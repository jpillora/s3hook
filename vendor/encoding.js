/**
 * @namespace Encoding functions
 * @author Anonymized
 * @description
 * <p>Support for ASCII, UTF-8, Base64 and Hex encoding.</p>
 * <p>DJS is simply not good at encoding, because it lacks the
 * built-in functions to get the character code at a given offset
 * from a string (charCodeAt), and its inverse, String.fromCharCode.</p>
 *
 * <p>This means we have to use a literal object whose field names are
 * ASCII characters and values are the associated codes, and a string
 * containing every character sorted by code for the inverse operation.</p>
 *
 * <p>For UTF-8, such a table would be too large and instead, we use
 * binary search on the string containing all UTF-8 characters,
 * using the built in lexicographic order of JavaScript.
 * Since the complete UTF-8 alphabet is itself 200KB, it is loaded
 * from its own file, utf8.js. Loading this file is optional: without
 * it every non-ASCII character is treated like the null byte.</p>
 */
 var encoding =
 {
/** Hex alphabet. */
  hex: "0123456789abcdef",

/** UTF-8 alphabet. Initially contains the null byte, actual value is in utf8.js */
  utf8: "\x00",
  utf8_table: {},

/** The ASCII alphabet, can be used directly */
  ascii: "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0\xa1\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xab\xac\xad\xae\xaf\xb0\xb1\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xbb\xbc\xbd\xbe\xbf\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xdf\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe\xff",

/** ASCII code table. Has its own dynamic accessor. */
  ascii_table: {"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"\x00":0,"\x01":1,"\x02":2,"\x03":3,"\x04":4,"\x05":5,"\x06":6,"\x07":7,"\b":8,"\t":9,"\n":10,"\x0b":11,"\f":12,"\r":13,"\x0e":14,"\x0f":15,"\x10":16,"\x11":17,"\x12":18,"\x13":19,"\x14":20,"\x15":21,"\x16":22,"\x17":23,"\x18":24,"\x19":25,"\x1a":26,"\x1b":27,"\x1c":28,"\x1d":29,"\x1e":30,"\x1f":31," ":32,"!":33,'"':34,"#":35,"$":36,"%":37,"&":38,"'":39,"(":40,")":41,"*":42,"+":43,",":44,"-":45,".":46,"/":47,":":58,";":59,"<":60,"=":61,">":62,"?":63,"@":64,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"[":91,"\\":92,"]":93,"^":94,"_":95,"`":96,"a":97,"b":98,"c":99,"d":100,"e":101,"f":102,"g":103,"h":104,"i":105,"j":106,"k":107,"l":108,"m":109,"n":110,"o":111,"p":112,"q":113,"r":114,"s":115,"t":116,"u":117,"v":118,"w":119,"x":120,"y":121,"z":122,"{":123,"|":124,"}":125,"~":126,"\x7f":127,"\x80":128,"\x81":129,"\x82":130,"\x83":131,"\x84":132,"\x85":133,"\x86":134,"\x87":135,"\x88":136,"\x89":137,"\x8a":138,"\x8b":139,"\x8c":140,"\x8d":141,"\x8e":142,"\x8f":143,"\x90":144,"\x91":145,"\x92":146,"\x93":147,"\x94":148,"\x95":149,"\x96":150,"\x97":151,"\x98":152,"\x99":153,"\x9a":154,"\x9b":155,"\x9c":156,"\x9d":157,"\x9e":158,"\x9f":159,"\xa0":160,"\xa1":161,"\xa2":162,"\xa3":163,"\xa4":164,"\xa5":165,"\xa6":166,"\xa7":167,"\xa8":168,"\xa9":169,"\xaa":170,"\xab":171,"\xac":172,"\xad":173,"\xae":174,"\xaf":175,"\xb0":176,"\xb1":177,"\xb2":178,"\xb3":179,"\xb4":180,"\xb5":181,"\xb6":182,"\xb7":183,"\xb8":184,"\xb9":185,"\xba":186,"\xbb":187,"\xbc":188,"\xbd":189,"\xbe":190,"\xbf":191,"\xc0":192,"\xc1":193,"\xc2":194,"\xc3":195,"\xc4":196,"\xc5":197,"\xc6":198,"\xc7":199,"\xc8":200,"\xc9":201,"\xca":202,"\xcb":203,"\xcc":204,"\xcd":205,"\xce":206,"\xcf":207,"\xd0":208,"\xd1":209,"\xd2":210,"\xd3":211,"\xd4":212,"\xd5":213,"\xd6":214,"\xd7":215,"\xd8":216,"\xd9":217,"\xda":218,"\xdb":219,"\xdc":220,"\xdd":221,"\xde":222,"\xdf":223,"\xe0":224,"\xe1":225,"\xe2":226,"\xe3":227,"\xe4":228,"\xe5":229,"\xe6":230,"\xe7":231,"\xe8":232,"\xe9":233,"\xea":234,"\xeb":235,"\xec":236,"\xed":237,"\xee":238,"\xef":239,"\xf0":240,"\xf1":241,"\xf2":242,"\xf3":243,"\xf4":244,"\xf5":245,"\xf6":246,"\xf7":247,"\xf8":248,"\xf9":249,"\xfa":250,"\xfb":251,"\xfc":252,"\xfd":253,"\xfe":254,"\xff":255},

/** Base64 alphabet. Is missing the last two characters to support URL style */
  base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",

/** Binary search of a character inside a sorted string.
  * @param {string} char character to search
  * @param {string} alphabet string whose characters are sorted in lexicographic order
  * @returns {number} the position where char occurs in alphabet, or 0 if not found.
  */
  _searchCharTable: function(a, table)
  {
   var a = a+'', table = table+'', min = 0,
       max=table.length, m = 0, b = "";
   while(m != (m = (min+max)>>1))
   {
    b = (m>>>=0)<table.length ? table[m] : "";
    if(a == b) return m;
    if(a > b) min = m; else max = m;
   } 
   return 0;
  },

/** Hex representation of a byte.
  * @param {number} input byte
  * @returns {string} hex representation of the input, has always length 2.
  */
  b2h: function(c)
  {
   var t = this.hex+'', a = (c>>4)&15, b = c&15;
   return ((a>>>=0)<t.length?t[a]:"0")+((b>>>=0)<t.length?t[b]:"0");
  },

/** The code of a character in the base64 alphabet. Accept +- or /_, fallback is 0.
  * @param {string} input base64 character
  * @returns {number} base64 code from 0 to 63
  */
  b64c: function(s)
  {
   if(s=='+' || s=='-') return 62;
   if(s=='/' || s=='_') return 63;
   if(s >= "0" && s <= "9") return +s + 52;
   return this._searchCharTable(s,this.base64);
  },

/** charCodeAt emulation. Returns the code point of the input character
  * @param {string} input character
  * @returns {number} 16 bit character point. If input if not ASCII and utf8.js is not loaded, will return 0.
  */
  charCode: function(a)
  {
   var t = this.ascii_table;
   return (a.length == 1 && a <= "\xFF" ? t[a]
    : this._searchCharTable(a, this.utf8));
  },

/** ASCII code of input character.
  * @param {string} input character
  * @returns {number} ASCII code of input. Unlike encoding.charCode, will always return 0 if input is non-ASCII.
  */
  a2b: function(a)
  {
   var t = this.ascii_table;
   return (a.length==1 && a <= "\xFF" ? t[a] : 0);
  },

/** ASCII character from its code.
  * @param {number} input ASCII code, only first 8 bits are taken into account.
  * @returns {string} associated ASCII character.
  */
  b2a: function(n)
  {
   var a = this.ascii+'';
   return (n>>>=0)<a.length ? a[n] : "\x00";
  },

/** fromCharCode emulation. Can create unicode characters.
  * @param {number} input code point (truncated to 16 bits)
  * @returns {string} UCS-2 character of requested code point.
  */
  fromCharCode: function(n)
  {
   var a = this.ascii+'', u = this.utf8+'';
   return (n>>>=0)<a.length ? a[n]
    : (n>>>=0)<u.length ? u[n] : "\x00";
  },

/** Convert an ASCII string to an hexadecimal string
  * @param {string} input must be ASCII (uses a2b internally)
  * @returns {string} hex representation of input
  */
  astr2hstr: function(s)
  {
   var res = '', i = 0, s=s+'';
   for(i=0; i<s.length; i++)
    res += this.b2h(this.a2b(s[i]));
   return res;
  },

/** Convert an hexadecimal string to ASCII.
  * @param {string} input hex string
  * @returns {string} ASCII equivalent
  */
  hstr2astr: function(s)
  {
   var i = 0, u = 0, c = '', res = "",
       t = this.ascii+'', s = s + '';

   for(i=0; i<s.length; i++)
   {
    if(!(i&1)) c = s[i];
    else
    {
     u = +('0x'+c+s[i]);
     res += (u>>>=0)<t.length ? t[u] : "\x00";
    }
   }
   return res;
  },

/** Encode a raw ASCII string back into a JavaScript string
  * @param {string} input ASCII
  * @returns {string} JavaScript unicode string representing the UTF-8 input.
  */
  utf8_encode: function(s)
  {
   var res = "", i = 0, c = 0, p = '',
       buffer = [0,0,0,0], expected = [0,0];

   for(i=0; i < s.length; i++)
   {
    c = this.a2b(p = s[i]);
    if(expected[0] != 0)
    {
     // Invalied continuation
     if(c<128 || c > 191){expected=[0,0]; continue}
     buffer[(expected[1]+1-expected[0]--)&3] = c;

     if(!expected[0])
     {
      res += this.fromCharCode(
        expected[1]==1 ? (buffer[0]&31)<<6 | (buffer[1] & 63)
         : (buffer[0] & 15)<<12 | (buffer[1] & 63)<<6 | (buffer[2] & 63));
     }
     else continue;
    }
    buffer[0] = c;

    if(c<128) res += p;
    else if(c>191 && c<224) expected = [1,1];
    else if(c>=224 && c<240) expected = [2,2];
    // Otherwise, invalid head (ignored)
   }

   return res;
  },

/** Decode an UTF-8 string to its raw ASCII equivalent.
  * @param {string} input JavaScript string (containing unicode characters)
  * @returns {string} decoded ASCII string
  */
  utf8_decode: function(s)
  {
   var res = "", i = 0, c = 0, s = s+'',
       x = this.b2a(0);

   for(i=0; i<s.length; i++)
   {
    c = this.charCode(x = s[i]);
    if(c < 128) res += x;
    else if(c < 2048)
     res += this.b2a((c>>6)|192)+this.b2a((c&63)|128);
    else
     res += this.b2a((c>>12)|224)+this.b2a(128|(c>>6)&63)+this.b2a(128|c&63);
   }

   return res;
  },

/** Encode an ASCII string to base64
  * @param {string} input ASCII
  * @returns {string} base64 encoding of input.
  */
  base64_encode: function(s)
  {
   return this._base64_encode(s, false);
  },

/** Encode an ASCII string to url-compatible base64
  * @param {string} input ASCII
  * @returns {string} url-base64 encoding of input.
  */
  base64_urlencode: function(s)
  {
   return this._base64_encode(s, true);
  },

  _base64_encode: function(s, url)
  {
   var res = "", i = 0, c = 0, s = s+'',
       buf = [0,0], pad = !url ? '=' : '', p = '',
       table = this.base64 + "0123456789" + (url ? '-_' : '+/'),
       chr = function(i){return (i>>>=0)<table.length?table[i]:"A"};

   for(i=0; i < s.length; i++)
   {
    c = this.a2b(s[i]);

    if(i%3 == 2)
    {
     c += (buf[1]<<8) + (buf[0]<<16);
     res += chr((c>>>18)&63);
     res += chr((c>>>12)&63);
     res += chr((c>>>6)&63);
     res += chr(c&63);
     buf = [0, 0];
    }
    else buf[(i%3)&1] = c;
   }

   // Padding
   if(i%3 != 0)
   {
    c = (buf[1]<<8) + (buf[0]<<16);
    res += chr((c>>>18)&63);
    res += chr((c>>>12)&63);
    res += (i%3==2)?chr((c>>>6)&63):pad;
    res += pad;
   }

   return res;
  },

/** Decode a base64-encoded string to ASCII
  * @param {string} input base64 (can be url-safe or not)
  * @returns {string} the decoded ASCII string.
  */
  base64_decode: function(s)
  {
   var s = s+'', res = "", buf = [0,0,0,0],
       i = 0, x = '', c = 0;

   if((s.length&3) != 0) s+='=';
   for(i=0; i < s.length; i++)
   {
    if((x = s[i]) == "=") break;
    c = this.b64c(x);

    if((i&3) == 3)
    {
     c += (buf[2]<<6) + (buf[1]<<12) + (buf[0]<<18);
     res += this.b2a((c>>>16)&255);
     res += this.b2a((c>>>8)&255);
     res += this.b2a(c&255);
     buf = [0,0,0,0];
    }
    else buf[(i%4)&3] = c;
   }

   // Padding
   if((i&3)>1)
   {
    c = (buf[2]<<6) + (buf[1]<<12) + (buf[0]<<18);
    res += this.b2a((c>>>16)&255);
    if((i&3) == 3) res += this.b2a((c>>>8)&255);
   }

   return res;
  },
 };

