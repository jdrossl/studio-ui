tinyMCEPopup.requireLangPack();
var defaultFonts="Arial, Helvetica, sans-serif=Arial, Helvetica, sans-serif;Times New Roman, Times, serif=Times New Roman, Times, serif;Courier New, Courier, mono=Courier New, Courier, mono;Times New Roman, Times, serif=Times New Roman, Times, serif;Georgia, Times New Roman, Times, serif=Georgia, Times New Roman, Times, serif;Verdana, Arial, Helvetica, sans-serif=Verdana, Arial, Helvetica, sans-serif;Geneva, Arial, Helvetica, sans-serif=Geneva, Arial, Helvetica, sans-serif";
var defaultSizes="9;10;12;14;16;18;24;xx-small;x-small;small;medium;large;x-large;xx-large;smaller;larger";
var defaultMeasurement="+pixels=px;points=pt;inches=in;centimetres=cm;millimetres=mm;picas=pc;ems=em;exs=ex;%";
var defaultSpacingMeasurement="pixels=px;points=pt;inches=in;centimetres=cm;millimetres=mm;picas=pc;+ems=em;exs=ex;%";
var defaultIndentMeasurement="pixels=px;+points=pt;inches=in;centimetres=cm;millimetres=mm;picas=pc;ems=em;exs=ex;%";
var defaultWeight="normal;bold;bolder;lighter;100;200;300;400;500;600;700;800;900";
var defaultTextStyle="normal;italic;oblique";
var defaultVariant="normal;small-caps";
var defaultLineHeight="normal";
var defaultAttachment="fixed;scroll";
var defaultRepeat="no-repeat;repeat;repeat-x;repeat-y";
var defaultPosH="left;center;right";
var defaultPosV="top;center;bottom";
var defaultVAlign="baseline;sub;super;top;text-top;middle;bottom;text-bottom";
var defaultDisplay="inline;block;list-item;run-in;compact;marker;table;inline-table;table-row-group;table-header-group;table-footer-group;table-row;table-column-group;table-column;table-cell;table-caption;none";
var defaultBorderStyle="none;solid;dashed;dotted;double;groove;ridge;inset;outset";
var defaultBorderWidth="thin;medium;thick";
var defaultListType="disc;circle;square;decimal;lower-roman;upper-roman;lower-alpha;upper-alpha;none";
function aggregateStyles(b){var a={};
tinymce.each(b,function(e){if(e!==""){var c=tinyMCEPopup.editor.dom.parseStyle(e);
for(var d in c){if(c.hasOwnProperty(d)){if(a[d]===undefined){a[d]=c[d]
}else{if(d==="text-decoration"){if(a[d].indexOf(c[d])===-1){a[d]=a[d]+" "+c[d]
}}}}}}});
return a
}var applyActionIsInsert;
var existingStyles;
function init(a){var c=document.getElementById("container"),b;
existingStyles=aggregateStyles(tinyMCEPopup.getWindowArg("styles"));
c.style.cssText=tinyMCEPopup.editor.dom.serializeStyle(existingStyles);
applyActionIsInsert=a.getParam("edit_css_style_insert_span",false);
document.getElementById("toggle_insert_span").checked=applyActionIsInsert;
b=getBrowserHTML("background_image_browser","background_image","image","advimage");
document.getElementById("background_image_browser").innerHTML=b;
document.getElementById("text_color_pickcontainer").innerHTML=getColorPickerHTML("text_color_pick","text_color");
document.getElementById("background_color_pickcontainer").innerHTML=getColorPickerHTML("background_color_pick","background_color");
document.getElementById("border_color_top_pickcontainer").innerHTML=getColorPickerHTML("border_color_top_pick","border_color_top");
document.getElementById("border_color_right_pickcontainer").innerHTML=getColorPickerHTML("border_color_right_pick","border_color_right");
document.getElementById("border_color_bottom_pickcontainer").innerHTML=getColorPickerHTML("border_color_bottom_pick","border_color_bottom");
document.getElementById("border_color_left_pickcontainer").innerHTML=getColorPickerHTML("border_color_left_pick","border_color_left");
fillSelect(0,"text_font","style_font",defaultFonts,";",true);
fillSelect(0,"text_size","style_font_size",defaultSizes,";",true);
fillSelect(0,"text_size_measurement","style_font_size_measurement",defaultMeasurement,";",true);
fillSelect(0,"text_case","style_text_case","capitalize;uppercase;lowercase",";",true);
fillSelect(0,"text_weight","style_font_weight",defaultWeight,";",true);
fillSelect(0,"text_style","style_font_style",defaultTextStyle,";",true);
fillSelect(0,"text_variant","style_font_variant",defaultVariant,";",true);
fillSelect(0,"text_lineheight","style_font_line_height",defaultLineHeight,";",true);
fillSelect(0,"text_lineheight_measurement","style_font_line_height_measurement",defaultMeasurement,";",true);
fillSelect(0,"background_attachment","style_background_attachment",defaultAttachment,";",true);
fillSelect(0,"background_repeat","style_background_repeat",defaultRepeat,";",true);
fillSelect(0,"background_hpos_measurement","style_background_hpos_measurement",defaultMeasurement,";",true);
fillSelect(0,"background_vpos_measurement","style_background_vpos_measurement",defaultMeasurement,";",true);
fillSelect(0,"background_hpos","style_background_hpos",defaultPosH,";",true);
fillSelect(0,"background_vpos","style_background_vpos",defaultPosV,";",true);
fillSelect(0,"block_wordspacing","style_wordspacing","normal",";",true);
fillSelect(0,"block_wordspacing_measurement","style_wordspacing_measurement",defaultSpacingMeasurement,";",true);
fillSelect(0,"block_letterspacing","style_letterspacing","normal",";",true);
fillSelect(0,"block_letterspacing_measurement","style_letterspacing_measurement",defaultSpacingMeasurement,";",true);
fillSelect(0,"block_vertical_alignment","style_vertical_alignment",defaultVAlign,";",true);
fillSelect(0,"block_text_align","style_text_align","left;right;center;justify",";",true);
fillSelect(0,"block_whitespace","style_whitespace","normal;pre;nowrap",";",true);
fillSelect(0,"block_display","style_display",defaultDisplay,";",true);
fillSelect(0,"block_text_indent_measurement","style_text_indent_measurement",defaultIndentMeasurement,";",true);
fillSelect(0,"box_width_measurement","style_box_width_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_height_measurement","style_box_height_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_float","style_float","left;right;none",";",true);
fillSelect(0,"box_clear","style_clear","left;right;both;none",";",true);
fillSelect(0,"box_padding_left_measurement","style_padding_left_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_padding_top_measurement","style_padding_top_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_padding_bottom_measurement","style_padding_bottom_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_padding_right_measurement","style_padding_right_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_margin_left_measurement","style_margin_left_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_margin_top_measurement","style_margin_top_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_margin_bottom_measurement","style_margin_bottom_measurement",defaultMeasurement,";",true);
fillSelect(0,"box_margin_right_measurement","style_margin_right_measurement",defaultMeasurement,";",true);
fillSelect(0,"border_style_top","style_border_style_top",defaultBorderStyle,";",true);
fillSelect(0,"border_style_right","style_border_style_right",defaultBorderStyle,";",true);
fillSelect(0,"border_style_bottom","style_border_style_bottom",defaultBorderStyle,";",true);
fillSelect(0,"border_style_left","style_border_style_left",defaultBorderStyle,";",true);
fillSelect(0,"border_width_top","style_border_width_top",defaultBorderWidth,";",true);
fillSelect(0,"border_width_right","style_border_width_right",defaultBorderWidth,";",true);
fillSelect(0,"border_width_bottom","style_border_width_bottom",defaultBorderWidth,";",true);
fillSelect(0,"border_width_left","style_border_width_left",defaultBorderWidth,";",true);
fillSelect(0,"border_width_top_measurement","style_border_width_top_measurement",defaultMeasurement,";",true);
fillSelect(0,"border_width_right_measurement","style_border_width_right_measurement",defaultMeasurement,";",true);
fillSelect(0,"border_width_bottom_measurement","style_border_width_bottom_measurement",defaultMeasurement,";",true);
fillSelect(0,"border_width_left_measurement","style_border_width_left_measurement",defaultMeasurement,";",true);
fillSelect(0,"list_type","style_list_type",defaultListType,";",true);
fillSelect(0,"list_position","style_list_position","inside;outside",";",true);
fillSelect(0,"positioning_type","style_positioning_type","absolute;relative;static",";",true);
fillSelect(0,"positioning_visibility","style_positioning_visibility","inherit;visible;hidden",";",true);
fillSelect(0,"positioning_width_measurement","style_positioning_width_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_height_measurement","style_positioning_height_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_overflow","style_positioning_overflow","visible;hidden;scroll;auto",";",true);
fillSelect(0,"positioning_placement_top_measurement","style_positioning_placement_top_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_placement_right_measurement","style_positioning_placement_right_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_placement_bottom_measurement","style_positioning_placement_bottom_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_placement_left_measurement","style_positioning_placement_left_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_clip_top_measurement","style_positioning_clip_top_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_clip_right_measurement","style_positioning_clip_right_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_clip_bottom_measurement","style_positioning_clip_bottom_measurement",defaultMeasurement,";",true);
fillSelect(0,"positioning_clip_left_measurement","style_positioning_clip_left_measurement",defaultMeasurement,";",true);
TinyMCE_EditableSelects.init();
setupFormData();
showDisabledControls()
}function setupFormData(){var g=document.getElementById("container"),e=document.forms[0],d,a,c;
selectByValue(e,"text_font",g.style.fontFamily,true,true);
selectByValue(e,"text_size",getNum(g.style.fontSize),true,true);
selectByValue(e,"text_size_measurement",getMeasurement(g.style.fontSize));
selectByValue(e,"text_weight",g.style.fontWeight,true,true);
selectByValue(e,"text_style",g.style.fontStyle,true,true);
selectByValue(e,"text_lineheight",getNum(g.style.lineHeight),true,true);
selectByValue(e,"text_lineheight_measurement",getMeasurement(g.style.lineHeight));
selectByValue(e,"text_case",g.style.textTransform,true,true);
selectByValue(e,"text_variant",g.style.fontVariant,true,true);
e.text_color.value=tinyMCEPopup.editor.dom.toHex(g.style.color);
updateColor("text_color_pick","text_color");
e.text_underline.checked=inStr(g.style.textDecoration,"underline");
e.text_overline.checked=inStr(g.style.textDecoration,"overline");
e.text_linethrough.checked=inStr(g.style.textDecoration,"line-through");
e.text_blink.checked=inStr(g.style.textDecoration,"blink");
e.text_none.checked=inStr(g.style.textDecoration,"none");
updateTextDecorations();
e.background_color.value=tinyMCEPopup.editor.dom.toHex(g.style.backgroundColor);
updateColor("background_color_pick","background_color");
e.background_image.value=g.style.backgroundImage.replace(new RegExp("url\\('?([^']*)'?\\)","gi"),"$1");
selectByValue(e,"background_repeat",g.style.backgroundRepeat,true,true);
selectByValue(e,"background_attachment",g.style.backgroundAttachment,true,true);
selectByValue(e,"background_hpos",getNum(getVal(g.style.backgroundPosition,0)),true,true);
selectByValue(e,"background_hpos_measurement",getMeasurement(getVal(g.style.backgroundPosition,0)));
selectByValue(e,"background_vpos",getNum(getVal(g.style.backgroundPosition,1)),true,true);
selectByValue(e,"background_vpos_measurement",getMeasurement(getVal(g.style.backgroundPosition,1)));
selectByValue(e,"block_wordspacing",getNum(g.style.wordSpacing),true,true);
selectByValue(e,"block_wordspacing_measurement",getMeasurement(g.style.wordSpacing));
selectByValue(e,"block_letterspacing",getNum(g.style.letterSpacing),true,true);
selectByValue(e,"block_letterspacing_measurement",getMeasurement(g.style.letterSpacing));
selectByValue(e,"block_vertical_alignment",g.style.verticalAlign,true,true);
selectByValue(e,"block_text_align",g.style.textAlign,true,true);
e.block_text_indent.value=getNum(g.style.textIndent);
selectByValue(e,"block_text_indent_measurement",getMeasurement(g.style.textIndent));
selectByValue(e,"block_whitespace",g.style.whiteSpace,true,true);
selectByValue(e,"block_display",g.style.display,true,true);
e.box_width.value=getNum(g.style.width);
selectByValue(e,"box_width_measurement",getMeasurement(g.style.width));
e.box_height.value=getNum(g.style.height);
selectByValue(e,"box_height_measurement",getMeasurement(g.style.height));
selectByValue(e,"box_float",g.style.cssFloat||g.style.styleFloat,true,true);
selectByValue(e,"box_clear",g.style.clear,true,true);
setupBox(e,g,"box_padding","padding","");
setupBox(e,g,"box_margin","margin","");
setupBox(e,g,"border_style","border","Style");
setupBox(e,g,"border_width","border","Width");
setupBox(e,g,"border_color","border","Color");
updateColor("border_color_top_pick","border_color_top");
updateColor("border_color_right_pick","border_color_right");
updateColor("border_color_bottom_pick","border_color_bottom");
updateColor("border_color_left_pick","border_color_left");
e.elements.border_color_top.value=tinyMCEPopup.editor.dom.toHex(e.elements.border_color_top.value);
e.elements.border_color_right.value=tinyMCEPopup.editor.dom.toHex(e.elements.border_color_right.value);
e.elements.border_color_bottom.value=tinyMCEPopup.editor.dom.toHex(e.elements.border_color_bottom.value);
e.elements.border_color_left.value=tinyMCEPopup.editor.dom.toHex(e.elements.border_color_left.value);
selectByValue(e,"list_type",g.style.listStyleType,true,true);
selectByValue(e,"list_position",g.style.listStylePosition,true,true);
e.list_bullet_image.value=g.style.listStyleImage.replace(new RegExp("url\\('?([^']*)'?\\)","gi"),"$1");
selectByValue(e,"positioning_type",g.style.position,true,true);
selectByValue(e,"positioning_visibility",g.style.visibility,true,true);
selectByValue(e,"positioning_overflow",g.style.overflow,true,true);
e.positioning_zindex.value=g.style.zIndex?g.style.zIndex:"";
e.positioning_width.value=getNum(g.style.width);
selectByValue(e,"positioning_width_measurement",getMeasurement(g.style.width));
e.positioning_height.value=getNum(g.style.height);
selectByValue(e,"positioning_height_measurement",getMeasurement(g.style.height));
setupBox(e,g,"positioning_placement","","",["top","right","bottom","left"]);
d=g.style.clip.replace(new RegExp("rect\\('?([^']*)'?\\)","gi"),"$1");
d=d.replace(/,/g," ");
if(!hasEqualValues([getVal(d,0),getVal(d,1),getVal(d,2),getVal(d,3)])){e.positioning_clip_top.value=getNum(getVal(d,0));
selectByValue(e,"positioning_clip_top_measurement",getMeasurement(getVal(d,0)));
e.positioning_clip_right.value=getNum(getVal(d,1));
selectByValue(e,"positioning_clip_right_measurement",getMeasurement(getVal(d,1)));
e.positioning_clip_bottom.value=getNum(getVal(d,2));
selectByValue(e,"positioning_clip_bottom_measurement",getMeasurement(getVal(d,2)));
e.positioning_clip_left.value=getNum(getVal(d,3));
selectByValue(e,"positioning_clip_left_measurement",getMeasurement(getVal(d,3)))
}else{e.positioning_clip_top.value=getNum(getVal(d,0));
selectByValue(e,"positioning_clip_top_measurement",getMeasurement(getVal(d,0)));
e.positioning_clip_right.value=e.positioning_clip_bottom.value=e.positioning_clip_left.value
}}function getMeasurement(a){return a.replace(/^([0-9.]+)(.*)$/,"$2")
}function getNum(a){if(new RegExp("^(?:[0-9.]+)(?:[a-z%]+)$","gi").test(a)){return a.replace(/[^0-9.]/g,"")
}return a
}function inStr(a,b){return new RegExp(b,"gi").test(a)
}function getVal(d,c){var b=d.split(" ");
if(b.length>1){return b[c]
}return""
}function setValue(b,c,a){if(b.elements[c].type=="text"){b.elements[c].value=a
}else{selectByValue(b,c,a,true,true)
}}function setupBox(e,g,c,h,d,a){if(typeof(a)=="undefined"){a=["Top","Right","Bottom","Left"]
}if(isSame(g,h,d,a)){e.elements[c+"_same"].checked=true;
setValue(e,c+"_top",getNum(g.style[h+a[0]+d]));
e.elements[c+"_top"].disabled=false;
e.elements[c+"_right"].value="";
e.elements[c+"_right"].disabled=true;
e.elements[c+"_bottom"].value="";
e.elements[c+"_bottom"].disabled=true;
e.elements[c+"_left"].value="";
e.elements[c+"_left"].disabled=true;
if(e.elements[c+"_top_measurement"]){selectByValue(e,c+"_top_measurement",getMeasurement(g.style[h+a[0]+d]));
e.elements[c+"_left_measurement"].disabled=true;
e.elements[c+"_bottom_measurement"].disabled=true;
e.elements[c+"_right_measurement"].disabled=true
}}else{e.elements[c+"_same"].checked=false;
setValue(e,c+"_top",getNum(g.style[h+a[0]+d]));
e.elements[c+"_top"].disabled=false;
setValue(e,c+"_right",getNum(g.style[h+a[1]+d]));
e.elements[c+"_right"].disabled=false;
setValue(e,c+"_bottom",getNum(g.style[h+a[2]+d]));
e.elements[c+"_bottom"].disabled=false;
setValue(e,c+"_left",getNum(g.style[h+a[3]+d]));
e.elements[c+"_left"].disabled=false;
if(e.elements[c+"_top_measurement"]){selectByValue(e,c+"_top_measurement",getMeasurement(g.style[h+a[0]+d]));
selectByValue(e,c+"_right_measurement",getMeasurement(g.style[h+a[1]+d]));
selectByValue(e,c+"_bottom_measurement",getMeasurement(g.style[h+a[2]+d]));
selectByValue(e,c+"_left_measurement",getMeasurement(g.style[h+a[3]+d]));
e.elements[c+"_left_measurement"].disabled=false;
e.elements[c+"_bottom_measurement"].disabled=false;
e.elements[c+"_right_measurement"].disabled=false
}}}function isSame(j,k,h,d){var f=[],g,c;
if(typeof(d)=="undefined"){d=["Top","Right","Bottom","Left"]
}if(typeof(h)=="undefined"||h==null){h=""
}f[0]=j.style[k+d[0]+h];
f[1]=j.style[k+d[1]+h];
f[2]=j.style[k+d[2]+h];
f[3]=j.style[k+d[3]+h];
for(g=0;
g<f.length;
g++){if(f[g]==null){return false
}for(c=0;
c<f.length;
c++){if(f[c]!=f[g]){return false
}}}return true
}function hasEqualValues(c){var d,b;
for(d=0;
d<c.length;
d++){if(c[d]==null){return false
}for(b=0;
b<c.length;
b++){if(c[b]!=c[d]){return false
}}}return true
}function toggleApplyAction(){applyActionIsInsert=!applyActionIsInsert
}function applyAction(){var d=document.getElementById("container"),b=tinyMCEPopup.editor;
generateCSS();
tinyMCEPopup.restoreSelection();
var c=tinyMCEPopup.editor.dom.parseStyle(d.style.cssText);
if(applyActionIsInsert){b.formatter.register("plugin_style",{inline:"span",styles:existingStyles});
b.formatter.remove("plugin_style");
b.formatter.register("plugin_style",{inline:"span",styles:c});
b.formatter.apply("plugin_style")
}else{var a;
if(tinyMCEPopup.getWindowArg("applyStyleToBlocks")){a=b.selection.getSelectedBlocks()
}else{a=b.selection.getNode()
}b.dom.setAttrib(a,"style",tinyMCEPopup.editor.dom.serializeStyle(c))
}}function updateAction(){applyAction();
tinyMCEPopup.close()
}function generateCSS(){var e=document.getElementById("container"),d=document.forms[0],a=new RegExp("[0-9]+","g"),c,b;
e.style.cssText="";
e.style.fontFamily=d.text_font.value;
e.style.fontSize=d.text_size.value+(isNum(d.text_size.value)?(d.text_size_measurement.value||"px"):"");
e.style.fontStyle=d.text_style.value;
e.style.lineHeight=d.text_lineheight.value+(isNum(d.text_lineheight.value)?d.text_lineheight_measurement.value:"");
e.style.textTransform=d.text_case.value;
e.style.fontWeight=d.text_weight.value;
e.style.fontVariant=d.text_variant.value;
e.style.color=d.text_color.value;
c="";
c+=d.text_underline.checked?" underline":"";
c+=d.text_overline.checked?" overline":"";
c+=d.text_linethrough.checked?" line-through":"";
c+=d.text_blink.checked?" blink":"";
c=c.length>0?c.substring(1):c;
if(d.text_none.checked){c="none"
}e.style.textDecoration=c;
e.style.backgroundColor=d.background_color.value;
e.style.backgroundImage=d.background_image.value!=""?"url("+d.background_image.value+")":"";
e.style.backgroundRepeat=d.background_repeat.value;
e.style.backgroundAttachment=d.background_attachment.value;
if(d.background_hpos.value!=""){c="";
c+=d.background_hpos.value+(isNum(d.background_hpos.value)?d.background_hpos_measurement.value:"")+" ";
c+=d.background_vpos.value+(isNum(d.background_vpos.value)?d.background_vpos_measurement.value:"");
e.style.backgroundPosition=c
}e.style.wordSpacing=d.block_wordspacing.value+(isNum(d.block_wordspacing.value)?d.block_wordspacing_measurement.value:"");
e.style.letterSpacing=d.block_letterspacing.value+(isNum(d.block_letterspacing.value)?d.block_letterspacing_measurement.value:"");
e.style.verticalAlign=d.block_vertical_alignment.value;
e.style.textAlign=d.block_text_align.value;
e.style.textIndent=d.block_text_indent.value+(isNum(d.block_text_indent.value)?d.block_text_indent_measurement.value:"");
e.style.whiteSpace=d.block_whitespace.value;
e.style.display=d.block_display.value;
e.style.width=d.box_width.value+(isNum(d.box_width.value)?d.box_width_measurement.value:"");
e.style.height=d.box_height.value+(isNum(d.box_height.value)?d.box_height_measurement.value:"");
e.style.styleFloat=d.box_float.value;
e.style.cssFloat=d.box_float.value;
e.style.clear=d.box_clear.value;
if(!d.box_padding_same.checked){e.style.paddingTop=d.box_padding_top.value+(isNum(d.box_padding_top.value)?d.box_padding_top_measurement.value:"");
e.style.paddingRight=d.box_padding_right.value+(isNum(d.box_padding_right.value)?d.box_padding_right_measurement.value:"");
e.style.paddingBottom=d.box_padding_bottom.value+(isNum(d.box_padding_bottom.value)?d.box_padding_bottom_measurement.value:"");
e.style.paddingLeft=d.box_padding_left.value+(isNum(d.box_padding_left.value)?d.box_padding_left_measurement.value:"")
}else{e.style.padding=d.box_padding_top.value+(isNum(d.box_padding_top.value)?d.box_padding_top_measurement.value:"")
}if(!d.box_margin_same.checked){e.style.marginTop=d.box_margin_top.value+(isNum(d.box_margin_top.value)?d.box_margin_top_measurement.value:"");
e.style.marginRight=d.box_margin_right.value+(isNum(d.box_margin_right.value)?d.box_margin_right_measurement.value:"");
e.style.marginBottom=d.box_margin_bottom.value+(isNum(d.box_margin_bottom.value)?d.box_margin_bottom_measurement.value:"");
e.style.marginLeft=d.box_margin_left.value+(isNum(d.box_margin_left.value)?d.box_margin_left_measurement.value:"")
}else{e.style.margin=d.box_margin_top.value+(isNum(d.box_margin_top.value)?d.box_margin_top_measurement.value:"")
}if(!d.border_style_same.checked){e.style.borderTopStyle=d.border_style_top.value;
e.style.borderRightStyle=d.border_style_right.value;
e.style.borderBottomStyle=d.border_style_bottom.value;
e.style.borderLeftStyle=d.border_style_left.value
}else{e.style.borderStyle=d.border_style_top.value
}if(!d.border_width_same.checked){e.style.borderTopWidth=d.border_width_top.value+(isNum(d.border_width_top.value)?d.border_width_top_measurement.value:"");
e.style.borderRightWidth=d.border_width_right.value+(isNum(d.border_width_right.value)?d.border_width_right_measurement.value:"");
e.style.borderBottomWidth=d.border_width_bottom.value+(isNum(d.border_width_bottom.value)?d.border_width_bottom_measurement.value:"");
e.style.borderLeftWidth=d.border_width_left.value+(isNum(d.border_width_left.value)?d.border_width_left_measurement.value:"")
}else{e.style.borderWidth=d.border_width_top.value+(isNum(d.border_width_top.value)?d.border_width_top_measurement.value:"")
}if(!d.border_color_same.checked){e.style.borderTopColor=d.border_color_top.value;
e.style.borderRightColor=d.border_color_right.value;
e.style.borderBottomColor=d.border_color_bottom.value;
e.style.borderLeftColor=d.border_color_left.value
}else{e.style.borderColor=d.border_color_top.value
}e.style.listStyleType=d.list_type.value;
e.style.listStylePosition=d.list_position.value;
e.style.listStyleImage=d.list_bullet_image.value!=""?"url("+d.list_bullet_image.value+")":"";
e.style.position=d.positioning_type.value;
e.style.visibility=d.positioning_visibility.value;
if(e.style.width==""){e.style.width=d.positioning_width.value+(isNum(d.positioning_width.value)?d.positioning_width_measurement.value:"")
}if(e.style.height==""){e.style.height=d.positioning_height.value+(isNum(d.positioning_height.value)?d.positioning_height_measurement.value:"")
}e.style.zIndex=d.positioning_zindex.value;
e.style.overflow=d.positioning_overflow.value;
if(!d.positioning_placement_same.checked){e.style.top=d.positioning_placement_top.value+(isNum(d.positioning_placement_top.value)?d.positioning_placement_top_measurement.value:"");
e.style.right=d.positioning_placement_right.value+(isNum(d.positioning_placement_right.value)?d.positioning_placement_right_measurement.value:"");
e.style.bottom=d.positioning_placement_bottom.value+(isNum(d.positioning_placement_bottom.value)?d.positioning_placement_bottom_measurement.value:"");
e.style.left=d.positioning_placement_left.value+(isNum(d.positioning_placement_left.value)?d.positioning_placement_left_measurement.value:"")
}else{c=d.positioning_placement_top.value+(isNum(d.positioning_placement_top.value)?d.positioning_placement_top_measurement.value:"");
e.style.top=c;
e.style.right=c;
e.style.bottom=c;
e.style.left=c
}if(!d.positioning_clip_same.checked){c="rect(";
c+=(isNum(d.positioning_clip_top.value)?d.positioning_clip_top.value+d.positioning_clip_top_measurement.value:"auto")+" ";
c+=(isNum(d.positioning_clip_right.value)?d.positioning_clip_right.value+d.positioning_clip_right_measurement.value:"auto")+" ";
c+=(isNum(d.positioning_clip_bottom.value)?d.positioning_clip_bottom.value+d.positioning_clip_bottom_measurement.value:"auto")+" ";
c+=(isNum(d.positioning_clip_left.value)?d.positioning_clip_left.value+d.positioning_clip_left_measurement.value:"auto");
c+=")";
if(c!="rect(auto auto auto auto)"){e.style.clip=c
}}else{c="rect(";
b=isNum(d.positioning_clip_top.value)?d.positioning_clip_top.value+d.positioning_clip_top_measurement.value:"auto";
c+=b+" ";
c+=b+" ";
c+=b+" ";
c+=b+")";
if(c!="rect(auto auto auto auto)"){e.style.clip=c
}}e.style.cssText=e.style.cssText
}function isNum(a){return new RegExp("[0-9]+","g").test(a)
}function showDisabledControls(){var d=document.forms,c,b;
for(c=0;
c<d.length;
c++){for(b=0;
b<d[c].elements.length;
b++){if(d[c].elements[b].disabled){tinyMCEPopup.editor.dom.addClass(d[c].elements[b],"disabled")
}else{tinyMCEPopup.editor.dom.removeClass(d[c].elements[b],"disabled")
}}}}function fillSelect(h,k,d,b,l,c){var g,e,a,j;
h=document.forms[h];
l=typeof(l)=="undefined"?";":l;
if(c){addSelectValue(h,k,"","")
}e=tinyMCEPopup.getParam(d,b).split(l);
for(g=0;
g<e.length;
g++){j=false;
if(e[g].charAt(0)=="+"){e[g]=e[g].substring(1);
j=true
}a=e[g].split("=");
if(a.length>1){addSelectValue(h,k,a[0],a[1]);
if(j){selectByValue(h,k,a[1])
}}else{addSelectValue(h,k,a[0],a[0]);
if(j){selectByValue(h,k,a[0])
}}}}function toggleSame(d,c){var b=document.forms[0].elements,a;
if(d.checked){b[c+"_top"].disabled=false;
b[c+"_right"].disabled=true;
b[c+"_bottom"].disabled=true;
b[c+"_left"].disabled=true;
if(b[c+"_top_measurement"]){b[c+"_top_measurement"].disabled=false;
b[c+"_right_measurement"].disabled=true;
b[c+"_bottom_measurement"].disabled=true;
b[c+"_left_measurement"].disabled=true
}}else{b[c+"_top"].disabled=false;
b[c+"_right"].disabled=false;
b[c+"_bottom"].disabled=false;
b[c+"_left"].disabled=false;
if(b[c+"_top_measurement"]){b[c+"_top_measurement"].disabled=false;
b[c+"_right_measurement"].disabled=false;
b[c+"_bottom_measurement"].disabled=false;
b[c+"_left_measurement"].disabled=false
}}showDisabledControls()
}function synch(a,c){var b=document.forms[0];
b.elements[c].value=b.elements[a].value;
if(b.elements[a+"_measurement"]){selectByValue(b,c+"_measurement",b.elements[a+"_measurement"].value)
}}function updateTextDecorations(){var b=document.forms[0].elements;
var a=["text_underline","text_overline","text_linethrough","text_blink"];
var c=b.text_none.checked;
tinymce.each(a,function(d){b[d].disabled=c;
if(c){b[d].checked=false
}})
}tinyMCEPopup.onInit.add(init);