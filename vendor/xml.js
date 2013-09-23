str2xml.parser = window.DOMParser && new DOMParser();

function str2xml(str) {
  if (str2xml.parser)
    return str2xml.parser.parseFromString(str, "text/xml");

  var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async = false;
  xmlDoc.loadXML(str);
  return xmlDoc;
}

/**
 * Convert XML to JSON Object
 * @param {Object} XML DOM Document
 */

function xml2json(xml) {
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        obj['@attributes'][xml.attributes[j].nodeName] = xml.attributes[j].nodeValue;
      }
    }

  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      if (typeof (obj[xml.childNodes[i].nodeName]) == 'undefined') {
        obj[xml.childNodes[i].nodeName] = xml2json(xml.childNodes[i]);
      } else {
        if (typeof (obj[xml.childNodes[i].nodeName].length) == 'undefined') {
          var old = obj[xml.childNodes[i].nodeName];
          obj[xml.childNodes[i].nodeName] = [];
          obj[xml.childNodes[i].nodeName].push(old);
        }
        obj[xml.childNodes[i].nodeName].push(xml2json(xml.childNodes[i]));
      }
    }
  }

  var text = true
  for (var k in obj)
    if(k !== '#text')
      text = false;

  return text ? obj['#text'] : obj;
}