import posed from 'react-pose'
export const SBarPose = posed.div({
    closed: {
        height: 0,
        opacity:0,
        overflow:"hidden",
        top:0,
        width:'100%',
        applyAtEnd:{
            zIndex:0,
        }
    },
    open: {
        height: '100%',
        opacity:1,
        applyAtStart:{
            overflow:'scroll',
            zIndex:100

        }

    },
    transition: {duration:100}
})
export const MainMenu = posed.div({
    open:{
        height:'auto',
        x:0
    },
    closed:{
        x:({menuWidth})=> -menuWidth
    },
    transition: {
        ease:'linear',
        duration:100}
})
export const Sect = posed.div({
     enter: {
         opacity: 1,
         applyAtEnd:{
             zIndex:3
         }
    },
     exit: {
         opacity:0,
         applyAtEnd:{
             zIndex:1
         }
    },

    transition:{
        duration:100
    }
})
export const StatusBar = posed.div({
    open:{
        height:"100%",
        width:"100vw",
        opacity:1,

        applyAtStart:{
            overflow: 'hidden',
            backgroundColor:"rgba(0,0,0, .5)",

        },
        applyAtEnd: {
            zIndex:101,
            overflow:"scroll",
            minWidth: "350px",

        },
    },
    closed:{
        height:"5vh",
        width:"30vw",
        applyAtStart: {
            zIndex:2,
            overflow: 'hidden',
        },
        applyAtEnd: {
            zIndex:101,
            overflow:"hidden",
            backgroundColor:"rgba(0,0,0,0)",
        },
    },
    transition: {duration:60}
})

export const ModalPose = posed.div({
    open:{
        width:'100vw',
        height:'100vh',
        top:0,
        left:0,
        applyAtStart:{
            zIndex:110,
            position:'absolute',
        }
    },
    closed:{
        height:0,
        width:0,
        top:0,
        left:0,
        applyAtEnd:{
            overflow:'hidden',
            zIndex:0,
            position:'absolute',
        }
    },
    transition: {duration:100}
})
export const LoadFromDraft = posed.div({
    closed: {
        height: 0,
        top:0,
    },
    open: {
        height: 'auto',
        top:'7vh',
     },
    transition: {duration:160}
});
export const ArticleMenu = posed.div({
    closed:{
        left:"100%",
        position:"fixed",
        zIndex:"8",
        top:0,
    },
    open:{
        left:0,
        position:"fixed",
        zIndex:"8",
        top:0,
    },
    transition: {duration:160}
})

export const SearchMenuOpen = posed.div({
  closed: {
      height: 0,
      opacity:0,
      overflow:'hidden',
  },
  open: {
      height:'auto',
      opacity:1,
      paddingLeft:10,
      paddingRight:10,
  },
  transition: {duration:100}
});

export const SummaryPose = posed.div({
    closed:{
        height:0,
        overflow:'hidden',
        width:'100%',
        padding:0,
    },
    open:{
        height:"100%",
        width:'100%',
    },
    transition: {duration:200}
})
export const ArticleModal = posed.div({
    closed: {
        height: 0,
        opacity:0,
        top:0,
        overflow:"hidden",
        applyAtEnd: {
            overflow:"scroll",
            zIndex:0,


        },
    },
    open: {
        top:"0",
        height: '100%',
        opacity:1,
        applyAtEnd: {
            overflow:"scroll",


        },
    },
    transition: {duration:100}
})

export const TimeSeriesModal = posed.div({
    closed: {
        top:"50vh",
        width:"60vw",
        left:"100vw",
        opacity:0,
        height:"80vh",
        overflow:"hidden",
    },
    open: {
        top:"10vh",
        left:"10vw",
        width:"60vw",
        height:"70vh",
        opacity:1,
    },
    transition: {duration:100}
})
export const LogInMenuOpen = posed.div({
    closed: {
        height: 0,
        applyAtEnd:{
            opacity:0,
            zIndex:0,
        }
    },
    open: {
        height: 'auto',
        opacity:1,
        applyAtStart:{
            zIndex:100,
        }
    },
  transition: {duration:200}
});
export const Item = posed.div({
    enter: { opacity: 1 },
    exit: { opacity: 0 },
    transition:{
        duration:100
    }
})
export const Connections = posed.div({
    closed:{
        height: 0,
        overflow:'hidden',
        width:0,
    },
    open:{
        height: 'auto',
        overflow:'hidden',
        width:'30vw',
    },
    transition: {duration:200}
})

// export const ArticleCardDiv = posed.div({
//     closed:{
//         height:0;
//         width:100%;
//     },
//     open:{
//         height:'auto';
//
//     }
// })
//
// const card
