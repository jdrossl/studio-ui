CodeMirror.overlayMode=CodeMirror.overlayParser=function(b,a,c){return{startState:function(){return{base:CodeMirror.startState(b),overlay:CodeMirror.startState(a),basePos:0,baseCur:null,overlayPos:0,overlayCur:null}
},copyState:function(d){return{base:CodeMirror.copyState(b,d.base),overlay:CodeMirror.copyState(a,d.overlay),basePos:d.basePos,baseCur:null,overlayPos:d.overlayPos,overlayCur:null}
},token:function(e,d){if(e.start==d.basePos){d.baseCur=b.token(e,d.base);
d.basePos=e.pos
}if(e.start==d.overlayPos){e.pos=e.start;
d.overlayCur=a.token(e,d.overlay);
d.overlayPos=e.pos
}e.pos=Math.min(d.basePos,d.overlayPos);
if(e.eol()){d.basePos=d.overlayPos=0
}if(d.overlayCur==null){return d.baseCur
}if(d.baseCur!=null&&c){return d.baseCur+" "+d.overlayCur
}else{return d.overlayCur
}},indent:b.indent&&function(e,d){return b.indent(e.base,d)
},electricChars:b.electricChars,innerMode:function(d){return{state:d.base,mode:b}
}}
};