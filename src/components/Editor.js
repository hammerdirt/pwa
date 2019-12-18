import React, { Component } from 'react'
import tinymce from 'tinymce'
import 'tinymce/themes/silver'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/image'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/code'
import 'tinymce/plugins/contextmenu'
import 'tinymce/skins/ui/oxide-dark/skin.min.css'
import 'tinymce/skins/ui/oxide-dark/content.min.css'

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
    tinymce.init({
        selector: `#${this.props.id}`,
        plugins: ["autolink", "code", "image", "link", "codesample", "table","advlist", "lists", "imagetools"],
        menubar: 'file edit view insert format tools table help formats',
        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | image link codesample',
        // quickbars_selection_toolbar: 'bold italic link | quicklink h2 h3 | blockquote quickimage quicktable',
        // noneditable_noneditable_class: "mceNonEditable",
        // toolbar_drawer: 'sliding',
        contextmenu: "link image",
        height:"600",
        // image_advtab: true,
      //     content_css: [
      //   '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
      //   '//www.tiny.cloud/css/codepen.min.css'
      // ],
        content_style: '.left { text-align: left; }' +
        'img.left { float: left; }' +
        'table.left { float: left; }' +
        '.right { text-align: right; }' +
        'img.right { float: right; }' +
        'table.right { float: right; }' +
        '.center { text-align: center; }' +
        'img.center { display: block; margin: 0 auto; }' +
        'table.center { display: block; margin: 0 auto; }' +
        '.full { text-align: justify; }' +
        'img.full { display: inline-block; margin: 0 auto; }' +
        'table.full { display: block; margin: 0 auto; }' +
        '.bold { font-weight: bold; }' +
        '.italic { font-style: italic; }' +
        '.underline { text-decoration: underline; }' +
        '.example1 {}' +
        '.tablerow1 { background-color: #D3D3D3; }',
        formats: {
            alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'left' },
            aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'center' },
            alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'right' },
            alignfull: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'full' },
            bold: { inline: 'span', classes: 'bold' },
            italic: { inline: 'span', classes: 'italic' },
            underline: { inline: 'span', classes: 'underline', exact: true },
            strikethrough: { inline: 'del' },
            customformat: { inline: 'span', styles: { color: '#00ff00', fontSize: '20px' }, attributes: { title: 'My custom format'} , classes: 'example1'}
        },
        style_formats: [
            // { title: 'Custom format', format: 'customformat' },
            // { title: 'Align left', format: 'alignleft' },
            // { title: 'Align center', format: 'aligncenter' },
            // { title: 'Align right', format: 'alignright' },
            { title: 'Align full', format: 'alignfull' },
            { title: 'Bold text', inline: 'strong' },
            // { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
            { title: 'Article header', block: 'h2', styles: { color: '#0c2461', fontFamily:'sans-serif'}},
            { title: 'Section header', block: 'h3', styles: { color: '#1e3799', fontFamily:'"Trebucht MS", sans-serif' }},
            { title: 'Sub section header', block: 'h4', styles: { color: '#4a69bd', fontFamily:'sans-serif'}},
            { title: 'Important', block: 'h5', styles: { color: '#0c2461', fontFamily:'sans-serif'}},
            { title: 'Danger', block: 'h6', styles: { color: '#b71540', fontFamily:'sans-serif'}},
            { title: 'Badge', inline: 'span', styles: { display: 'inline-block', border: '1px solid #079992', 'border-radius': '5px', padding: '2px 5px', margin: '0 2px', color: '#079992' } },
            { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' },
            { title: 'Image formats' },
            { title: 'Image 50% Left inline', selector: 'img', styles: { 'float': 'left', 'margin': '10px', 'width':'50%'} },
            { title: 'Image 50% Right inline', selector: 'img', styles: { 'float': 'right', 'margin': '10px', 'width':'50%' } },
            { title: 'Image 80% Center block', selector: 'img', styles: { 'margin-left': '10px', 'width':'80%' } },
        ],
        setup: editor => {
            this.setState({ editor });
            editor.on('keyup change', () => {
              const content = editor.getContent();
              this.props.onEditorChange(content);
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
         // console.log(this.props.drafts)
         tinymce.activeEditor.setContent(this.props.drafts[0].article)
         this.setState({editingDraft:true})
      }
    }
    componentWillUnmount() {
        tinymce.remove(this.state.editor);
    }
    render() {
        return (
            <div style={{width:"100%"}}>
                <textarea id={this.props.id} value={this.props.content}  onEditorChange={this.props.onEditorChange} />
            </div>
        );
    }
}
export default OurEditor
