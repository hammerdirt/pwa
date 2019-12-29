import React, { Component } from 'react'
import tinymce from 'tinymce'
import '../theAppCss.css'
import Prism from "prismjs"
// import 'tinymce/skins/ui/oxide-dark/skin.min.css';
import 'tinymce/plugins/codesample'

class OurReader extends Component{
    constructor(props){
        super(props)
        this.state = {
            isWorking:"Editor state is here",
            editor:null,
            editingDraft:false,
        }
    }
    componentDidMount(){
        const content = this.props.content
        Prism.highlightAll()
        tinymce.init({
            selector:  `#${this.props.id}`,
            inline: true,
            readonly: 1,
            menubar: false,
            plugins: ["codesample"],
            height:"600",
            // content_css:['/theAppCss.css'],
            setup: function (editor) {
                editor.on('init', function (e) {
                      editor.setContent(content);
                  })
              },
            image_title: true,
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.content !== prevProps.content){
            const content = this.props.content
            Prism.highlightAll()
            tinymce.init({
                selector:  `#${this.props.id}`,
                inline: true,
                readonly: 1,
                menubar: false,
                // height:"600",
                content_css:['/prism.css'],
                setup: function (editor) {
                    editor.on('init', function (e) {
                          editor.setContent(content);
                      })
                  },
                image_title: true,
            })
        }
    }
    componentWillUnmount() {
        tinymce.remove(this.state.editor);
    }
    render() {
        return (
            <div style={{width:"100%"}}>
                <div id={this.props.id}></div>
            </div>
        );
    }
}
export default OurReader
