import React, { Component } from 'react'
import tinymce from 'tinymce'
import 'tinymce/themes/silver'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/image'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/code'
import Prism from "prismjs"
import 'tinymce/skins/ui/oxide/skin.min.css';
import '../theAppCss.css'

class OurEditor extends Component{
    constructor(props){
        super(props)
        this.state = {
            isWorking:"Editor state is here",
            editor:null,
            editingDraft:false,
        }
    }
    componentDidMount(){
        Prism.highlightAll()
        tinymce.init({
            selector: `#${this.props.id}`,
            plugins: [ "code", "image", "link", "codesample", "table","advlist", "lists", "imagetools"],
            menubar: 'file edit view insert format tools table help ',
            toolbar:'styleselect | bold italic underline strikethrough | removeformat link | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | image  | codesample ',
            contextmenu: "link image",
            height:"600",
            skin: false,
            link_assume_external_targets: true,
            relative_urls: false,
            convert_urls: false,
            remove_script_host : false,
            content_css:['/theAppCss.css', '/prism.css'],
            formats: {
                alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles:{ textAlign: 'left'} },
                aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles:{ textAlign: 'center'} },
                alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles:{ textAlign: 'right'} },
                alignfull: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: 'justify' },
                bold: { inline: 'span', styles: { fontWeight: 'bold', color:'#000000' }},
                italic: { inline: 'span', styles: {fontStyle: 'italic'}},
                underline: { inline: 'span', styles:{textDecoration:'underline'} },
                strikethrough: { inline: 'del' },
            },
            style_formats: [
                { title: 'Title', block: 'h2'},
                { title: 'Section', block: 'h3'},
                { title: 'Sub section', block: 'h4'},
                { title:'Important', block:'h5', styles:{color: '#1e3799'}},
                { title: 'Danger', block: 'h5', styles: { color: '#ff0000'}},
                {title: 'Article paragraph', block:'p'},
                { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
                {title: 'Blue text', inline:'span', styles:{color:'#1e3799'}},
                { title: 'Image formats' },
                { title: '50% Left inline', selector: 'img', styles: { 'float': 'left', 'margin': '10px', 'width':'50%'} },
                { title: '50% Right inline', selector: 'img', styles: { 'float': 'right', 'margin': '10px', 'width':'50%' } },
                { title: '80% Center block', selector: 'img', styles: { 'margin-left': '10%', 'width':'80%' } },
            ],
            setup: editor => {
                this.setState({ editor });
                editor.on('keyup change', () => {
                  const content = editor.getContent()
                  this.setState({
                      editorContent:content
                  })
              });
            },
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: function (cb, value, meta) {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = function () {
                    var file = this.files[0];
                    var reader = new FileReader();
                    reader.onload = function () {
                        var id = 'blobid' + (new Date()).getTime();
                        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                        var base64 = reader.result.split(',')[1];
                        var blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);
                        /* call the callback and populate the Title field with the file name */
                        cb(blobInfo.blobUri(), { title: file.name });
                    };
                reader.readAsDataURL(file);
                };
                input.click();
            }
    })
    }
    componentDidUpdate(prevProps) {
        if (this.props.clearEditor && this.state.editingDraft && !this.props.drafts){
             console.log("not editing draft now")
             tinymce.activeEditor.setContent("")
             this.setState({editingDraft:false})
        }else if (this.props.drafts && !this.state.editingDraft){
            console.log("editing draft now")
            tinymce.activeEditor.setContent(this.props.drafts[0].article)
            this.setState({editingDraft:true})
        }else if (this.props.save !== prevProps.save && this.props.save){
            this.props.onEditorChange(this.state.editorContent)
        }

    }
    componentWillUnmount() {
        tinymce.remove(this.state.editor);
    }
    render() {
        return (
            <div style={{width:"100%"}}>
                <div id={this.props.id} value={this.props.content} />
            </div>
        );
    }
}
export default OurEditor
