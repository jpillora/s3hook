// s3.js - v0.1.0 - https://github.com/jpillora/aws-sdk-browser
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2013
(function(window,document,undefined) {
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


/**
 * @namespace Hash functions
 * @author Anonymized
 * @description
 * <p>Hash functions and hashing.</p>
 * @requires encoding
 */
 var hashing = (function()
 {
  var sha1 =
  {
   name: 'sha1',
   identifier: '2b0e03021a',
   size: 20,
   block: 64,
  
   hash: function(s)
   {
    var len = (s+='\x80').length, blocks = len >> 6,
        chunck = len&63, res = "", i = 0, j = 0,
        H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],
        w = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    while(chunck++ != 56)
    {
     s+="\x00";
     if(chunck == 64){ blocks++; chunck = 0; }
    }

    for(s+="\x00\x00\x00\x00", chunck=3, len=8*(len-1); chunck >= 0; chunck--)
     s += encoding.b2a(len >> (8*chunck) &255);

    for(i=0; i < s.length; i++)
    {
     j = (j<<8) + encoding.a2b(s[i]);
     if((i&3)==3){ w[(i>>2)&15] = j; j = 0; }
     if((i&63)==63) this._round(H, w);
    }

    for(i=0; i < H.length; i++)
     for(j=3; j >= 0; j--)
      res += encoding.b2a(H[i] >> (8*j) & 255);

    return res;
   },

   _round: function(H, w)
   {
    var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], i = 0,
        k = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],
        S = function(n,x){return (x << n)|(x >>> 32-n)}, tmp = 0,

    f = function(r, b, c, d)
    {
     if(r < 20) return (b & c) | (~b & d);
     if(r < 40) return b ^ c ^ d;
     if(r < 60) return (b & c) | (b & d) | (c & d);
     return b ^ c ^ d;
    }

    for(i=0; i < 80; i++)
    {
     if(i >= 16) w[i&127] = S(1, w[(i-3)&127]  ^ w[(i-8)&127]
                               ^ w[(i-14)&127] ^ w[(i-16)&127]);
     tmp = (S(5, a) + f(i, b, c, d) + e + w[i&127] + k[(i/20)&3])|0;
     e = d; d = c; c = S(30, b); b = a; a = tmp;
    }

    H[0] = (H[0]+a)|0; H[1] = (H[1]+b)|0; H[2] = (H[2]+c)|0;
    H[3] = (H[3]+d)|0; H[4] = (H[4]+e)|0;
   }
  };

  var sha256 =
  {
   name: 'sha-256',
   identifier: '608648016503040201',
   size: 32,
   block: 64,

   key: [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
         0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
         0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
         0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
         0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
         0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
         0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
         0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],

   hash: function(s)
   {
    var s = s + '\x80', len = s.length, blocks = len >> 6, chunck = len & 63,
       res = '', p = '', i = 0, j = 0, k = 0, l = 0,
       H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19],
       w = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    while(chunck++ != 56)
    {
     s+="\x00";
     if(chunck == 64){ blocks++; chunck = 0; }
    }

    for(s+="\x00\x00\x00\x00", chunck=3, len=8*(len-1); chunck >= 0; chunck--)
     s += encoding.b2a(len >> (8*chunck) &255);

    for(i=0; i < s.length; i++)
    {
     j = (j<<8) + encoding.a2b(s[i]);
     if((i&3)==3){ w[(i>>2)&15] = j; j = 0; }
     if((i&63)==63) this._round(H,w);
    }

    for(i=0; i < H.length; i++)
     for(j=3; j >= 0; j--)
      res += encoding.b2a(H[i] >> (8*j) & 255);

    return res;
   },

   _round: function(H,w)
   {
    var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4],
        f = H[5], g = H[6], h = H[7], t = 0, u = 0, v = 0, tmp = 0;

    for(t=0; t < 64; t++)
    {
     if(t < 16) tmp = w[t&15];
     else
     {
      u = w[(t+1)&15]; v = w[(t+14)&15];
      tmp = w[t&15] = ((u>>>7  ^ u>>>18 ^ u>>>3  ^ u<<25 ^ u<<14) +
                       (v>>>17 ^ v>>>19 ^ v>>>10 ^ v<<15 ^ v<<13) +
                       w[t&15] + w[(t+9)&15]) | 0;
     }

     tmp = (tmp + h + (e>>>6 ^ e>>>11 ^ e>>>25 ^ e<<26 ^ e<<21 ^ e<<7)
            + (g ^ e & (f^g)) + this.key[t&63]);
     h = g; g = f; f = e; e = d + tmp | 0; d = c; c = b; b = a;
     a = (tmp + ((b&c) ^ (d&(b^c))) + (b>>>2 ^ b>>>13 ^ b>>>22 ^ b<<30 ^ b<<19 ^ b<<10)) | 0;
    }

    H[0]=H[0]+a|0; H[1]=H[1]+b|0; H[2]=H[2]+c|0; H[3]=H[3]+d|0;
    H[4]=H[4]+e|0; H[5]=H[5]+f|0; H[6]=H[6]+g|0; H[7]=H[7]+h|0;
   }
  };

  return {
/** SHA-256 hash function wrapper. This object can be used
  * to configure primitives that rely on a hash function,
  * for instance hashing.hmac_hash = hashing.sha256
  */
   sha256: sha256,

/** SHA1 hash function wrapper. This object can be used
  * to configure primitives that rely on a hash function,
  * for instance rsa.pss_hash = hashing.sha1
  */
   sha1: sha1,

/** SHA-256 helper function (hex output)
  * @param {string} m ASCII message to digest with SHA-256.
  * @returns {string} Hex string representing the hash.
  */
   SHA256: function(s)
   {
    return encoding.astr2hstr(this.sha256.hash(s));
   },

/** SHA1 helper function (hex output)
  * @param {string} m ASCII message to digest with SHA1.
  * @returns {string} Hex string representing the hash.
  */
   SHA1: function(s)
   {
    return encoding.astr2hstr(this.sha1.hash(s));
   },

/** The hash function to use for HMAC, hashing.sha256 by default
  */
   hmac_hash: sha256,

/** Hash-based message authentication code
  * @param {string} key key of the authentication
  * @param {string} msg message to authenticate
  * @returns {string} authentication code, as an hex string.
  */
   HMAC: function(key, msg)
   {
    var key = key+'', msg = msg+'', i = 0, h = this.hmac_hash,
        c = 0, p = '', inner = "", outer = "";

    if(key.length > h.block) key = h.hash(key);
    while(key.length < h.block) key += "\x00";

    for(i=0; i < key.length; i++)
    {
     c = encoding.a2b(key[i]);
     inner += encoding.b2a(c ^ 0x36);
     outer += encoding.b2a(c ^ 0x5C);
    }

    return encoding.astr2hstr(h.hash(outer + h.hash(inner + msg)));
   }
  };
 })();


// XDomain - v0.4.1 - https://github.com/jpillora/xdomain
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2013
(function(window,document,undefined) {
// XHook - v0.1.1 - https://github.com/jpillora/xhook
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2013
(function(window,document,undefined) {
var EVENTS, FNS, PROPS, READY_STATE, RESPONSE_TEXT, WITH_CREDS, convertHeaders, create, patchClass, patchXhr, xhook, xhooks,
  __slice = [].slice;

FNS = ["open", "setRequestHeader", "send", "abort", "getAllResponseHeaders", "getResponseHeader", "overrideMimeType"];

EVENTS = ["onreadystatechange", "onprogress", "onloadstart", "onloadend", "onload", "onerror", "onabort"];

PROPS = ["readyState", "responseText", "withCredentials", "statusText", "status", "response", "responseType", "responseXML", "upload"];

READY_STATE = PROPS[0];

RESPONSE_TEXT = PROPS[1];

WITH_CREDS = PROPS[2];

create = function(parent) {
  var F;
  F = function() {};
  F.prototype = parent;
  return new F;
};

xhooks = [];

xhook = function(callback, i) {
  if (i == null) {
    i = xhooks.length;
  }
  return xhooks.splice(i, 0, callback);
};

convertHeaders = function(h, dest) {
  var header, headers, k, v, _i, _len;
  if (dest == null) {
    dest = {};
  }
  switch (typeof h) {
    case "object":
      headers = [];
      for (k in h) {
        v = h[k];
        headers.push("" + k + ":\t" + v);
      }
      return headers.join('\n');
    case "string":
      headers = h.split('\n');
      for (_i = 0, _len = headers.length; _i < _len; _i++) {
        header = headers[_i];
        if (/([^:]+):\s*(.+)/.test(header)) {
          if (!dest[RegExp.$1]) {
            dest[RegExp.$1] = RegExp.$2;
          }
        }
      }
      return dest;
  }
};

xhook.headers = convertHeaders;

xhook.PROPS = PROPS;

patchClass = function(name) {
  var Class;
  Class = window[name];
  if (!Class) {
    return;
  }
  return window[name] = function(arg) {
    if (typeof arg === "string" && !/\.XMLHTTP/.test(arg)) {
      return;
    }
    return patchXhr(new Class(arg), Class);
  };
};

patchClass("ActiveXObject");

patchClass("XMLHttpRequest");

patchXhr = function(xhr, Class) {
  var callback, cloneEvent, data, eventName, fn, hooked, requestHeaders, responseHeaders, setAllValues, setValue, user, userOnCalls, userOnChanges, userRequestHeaders, userResponseHeaders, userSets, x, xhrDup, _fn, _i, _j, _k, _len, _len1, _len2;
  if (xhooks.length === 0) {
    return xhr;
  }
  hooked = false;
  xhrDup = {};
  x = {};
  x[WITH_CREDS] = false;
  requestHeaders = {};
  responseHeaders = {};
  data = {};
  cloneEvent = function(e) {
    var clone, key, val;
    clone = {};
    for (key in e) {
      val = e[key];
      clone[key] = val === xhr ? x : val;
    }
    return clone;
  };
  user = create(data);
  userSets = {};
  user.set = function(prop, val) {
    var _results;
    hooked = true;
    userSets[prop] = 1;
    if (prop === READY_STATE) {
      _results = [];
      while (x[READY_STATE] < val) {
        x[READY_STATE]++;
        if (x[READY_STATE] === xhr[READY_STATE]) {
          continue;
        }
        user.trigger('readystatechange');
        if (x[READY_STATE] === 1) {
          user.trigger('loadstart');
        }
        if (x[READY_STATE] === 4) {
          user.trigger('load');
          _results.push(user.trigger('loadend'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else {
      return x[prop] = val;
    }
  };
  userRequestHeaders = create(requestHeaders);
  user.setRequestHeader = function(key, val) {
    hooked = true;
    userRequestHeaders[key] = val;
    if (!data.opened) {
      return;
    }
    return xhr.setRequestHeader(key, val);
  };
  userResponseHeaders = create(responseHeaders);
  user.setResponseHeader = function(key, val) {
    hooked = true;
    return userResponseHeaders[key] = val;
  };
  userOnChanges = {};
  userOnCalls = {};
  user.onChange = function(event, callback) {
    hooked = true;
    return (userOnChanges[event] = userOnChanges[event] || []).push(callback);
  };
  user.onCall = function(event, callback) {
    hooked = true;
    return (userOnCalls[event] = userOnCalls[event] || []).push(callback);
  };
  user.trigger = function(event, obj) {
    var _ref;
    if (obj == null) {
      obj = {};
    }
    event = event.replace(/^on/, '');
    obj.type = event;
    return (_ref = x['on' + event]) != null ? _ref.call(x, obj) : void 0;
  };
  user.serialize = function() {
    var k, p, props, req, res, v, _i, _len;
    props = {};
    for (_i = 0, _len = PROPS.length; _i < _len; _i++) {
      p = PROPS[_i];
      props[p] = x[p];
    }
    res = {};
    for (k in userResponseHeaders) {
      v = userResponseHeaders[k];
      res[k] = v;
    }
    req = {};
    for (k in userRequestHeaders) {
      v = userRequestHeaders[k];
      req[k] = v;
    }
    return {
      method: data.method,
      url: data.url,
      async: data.async,
      body: data.body,
      responseHeaders: res,
      requestHeaders: req,
      props: props
    };
  };
  user.deserialize = function(obj) {
    var h, k, p, v, _i, _len, _ref, _ref1, _ref2, _ref3;
    _ref = ['method', 'url', 'async', 'body'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      if (obj[k]) {
        user[k] = obj[k];
      }
    }
    _ref1 = obj.responseHeaders || {};
    for (h in _ref1) {
      v = _ref1[h];
      user.setResponseHeader(h, v);
    }
    _ref2 = obj.requestHeaders || {};
    for (h in _ref2) {
      v = _ref2[h];
      user.setRequestHeader(h, v);
    }
    _ref3 = obj.props || {};
    for (p in _ref3) {
      v = _ref3[p];
      user.set(p, v);
    }
  };
  for (_i = 0, _len = FNS.length; _i < _len; _i++) {
    fn = FNS[_i];
    if (xhr[fn]) {
      (function(key) {
        return x[key] = function() {
          var args, callback, callbacks, newargs, result, _j, _len1;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          data.opened = !data.opened && key === 'open';
          data.sent = !data.sent && key === 'send';
          switch (key) {
            case "getAllResponseHeaders":
              return convertHeaders(userResponseHeaders);
            case "send":
              data.body = args[0];
              break;
            case "open":
              data.method = args[0];
              data.url = args[1];
              data.async = args[2];
          }
          newargs = args;
          callbacks = userOnCalls[key] || [];
          for (_j = 0, _len1 = callbacks.length; _j < _len1; _j++) {
            callback = callbacks[_j];
            result = callback(args);
            if (result === false) {
              return;
            }
            if (result) {
              newargs = result;
            }
          }
          if (key === "setRequestHeader") {
            requestHeaders[newargs[0]] = newargs[1];
            if (userRequestHeaders[args[0]] !== undefined) {
              return;
            }
          }
          if (xhr[key]) {
            return xhr[key].apply(xhr, newargs);
          }
        };
      })(fn);
    }
  }
  setAllValues = function() {
    var err, prop, _j, _len1, _results;
    try {
      _results = [];
      for (_j = 0, _len1 = PROPS.length; _j < _len1; _j++) {
        prop = PROPS[_j];
        _results.push(setValue(prop, xhr[prop]));
      }
      return _results;
    } catch (_error) {
      err = _error;
      if (err.constructor.name === 'TypeError') {
        throw err;
      }
    }
  };
  setValue = function(prop, curr) {
    var callback, callbacks, key, override, prev, result, val, _j, _len1;
    prev = xhrDup[prop];
    if (curr === prev) {
      return;
    }
    xhrDup[prop] = curr;
    if (prop === READY_STATE) {
      if (curr === 1) {
        for (key in userRequestHeaders) {
          val = userRequestHeaders[key];
          xhr.setRequestHeader(key, val);
        }
      }
      if (curr === 2) {
        data.statusCode = xhr.status;
        convertHeaders(xhr.getAllResponseHeaders(), responseHeaders);
      }
    }
    callbacks = userOnChanges[prop] || [];
    for (_j = 0, _len1 = callbacks.length; _j < _len1; _j++) {
      callback = callbacks[_j];
      result = callback(curr, prev);
      if (result !== undefined) {
        override = result;
      }
    }
    if (userSets[prop]) {
      return;
    }
    return x[prop] = override === undefined ? curr : override;
  };
  _fn = function(eventName) {
    return xhr[eventName] = function(event) {
      var copy;
      setAllValues();
      if (event) {
        copy = cloneEvent(event);
      }
      (window.E = window.E || []).push(copy);
      if (x[eventName]) {
        return x[eventName].call(x, copy);
      }
    };
  };
  for (_j = 0, _len1 = EVENTS.length; _j < _len1; _j++) {
    eventName = EVENTS[_j];
    _fn(eventName);
  }
  setAllValues();
  for (_k = 0, _len2 = xhooks.length; _k < _len2; _k++) {
    callback = xhooks[_k];
    callback.call(null, user);
  }
  if (hooked) {
    return x;
  } else {
    return xhr;
  }
};

window.xhook = xhook;
}(window,document));
'use strict';
var Frame, PING, currentOrigin, feature, getMessage, guid, masters, onMessage, p, parseUrl, script, setMessage, setupMaster, setupSlave, slaves, toRegExp, warn, _i, _j, _len, _len1, _ref, _ref1;

currentOrigin = location.protocol + '//' + location.host;

warn = function(str) {
  str = "xdomain (" + currentOrigin + "): " + str;
  if (console['warn']) {
    return console.warn(str);
  } else {
    return alert(str);
  }
};

_ref = ['postMessage', 'JSON'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  feature = _ref[_i];
  if (!window[feature]) {
    warn("requires '" + feature + "' and this browser does not support it");
    return;
  }
}

PING = 'XPING';

guid = function() {
  return (Math.random() * Math.pow(2, 32)).toString(16);
};

parseUrl = function(url) {
  if (/(https?:\/\/[^\/]+)(\/.*)?/.test(url)) {
    return {
      origin: RegExp.$1,
      path: RegExp.$2
    };
  } else {
    return null;
  }
};

toRegExp = function(obj) {
  var str;
  if (obj instanceof RegExp) {
    return obj;
  }
  str = obj.toString().replace(/\W/g, function(str) {
    return "\\" + str;
  }).replace(/\\\*/g, ".+");
  return new RegExp("^" + str + "$");
};

onMessage = function(fn) {
  if (document.addEventListener) {
    return window.addEventListener("message", fn);
  } else {
    return window.attachEvent("onmessage", fn);
  }
};

setMessage = function(obj) {
  return JSON.stringify(obj);
};

getMessage = function(str) {
  return JSON.parse(str);
};

setupSlave = function(masters) {
  onMessage(function(event) {
    var frame, k, master, masterRegex, message, origin, p, pathRegex, proxyXhr, regex, req, v, _ref1;
    origin = event.origin;
    pathRegex = null;
    for (master in masters) {
      regex = masters[master];
      try {
        masterRegex = toRegExp(master);
        if (masterRegex.test(origin)) {
          pathRegex = toRegExp(regex);
          break;
        }
      } catch (_error) {}
    }
    if (!pathRegex) {
      warn("blocked request from: '" + origin + "'");
      return;
    }
    frame = event.source;
    message = getMessage(event.data);
    req = message.req;
    p = parseUrl(req.url);
    if (!(p && pathRegex.test(p.path))) {
      warn("blocked request to path: '" + p.path + "' by regex: " + regex);
      return;
    }
    proxyXhr = new XMLHttpRequest();
    proxyXhr.open(req.method, req.url);
    proxyXhr.onreadystatechange = function() {
      var m, res, _j, _ref1;
      if (proxyXhr.readyState !== 4) {
        return;
      }
      res = {
        props: {}
      };
      _ref1 = xhook.PROPS;
      for (_j = _ref1.length - 1; _j >= 0; _j += -1) {
        p = _ref1[_j];
        if (p !== 'responseXML') {
          res.props[p] = proxyXhr[p];
        }
      }
      res.responseHeaders = xhook.headers(proxyXhr.getAllResponseHeaders());
      m = setMessage({
        id: message.id,
        res: res
      });
      return frame.postMessage(m, origin);
    };
    _ref1 = req.requestHeaders;
    for (k in _ref1) {
      v = _ref1[k];
      proxyXhr.setRequestHeader(k, v);
    }
    return proxyXhr.send(req.body || null);
  });
  if (window === window.parent) {
    return warn("slaves must be in an iframe");
  } else {
    return window.parent.postMessage(PING, '*');
  }
};

setupMaster = function(slaves) {
  onMessage(function(e) {
    var _ref1;
    return (_ref1 = Frame.prototype.frames[e.origin]) != null ? _ref1.recieve(e) : void 0;
  });
  return xhook(function(xhr) {
    xhr.onCall('open', function(args) {
      var p;
      p = parseUrl(args[1]);
      if (!(p && slaves[p.origin])) {
        return;
      }
      if (args[2] === false) {
        warn("sync not supported");
      }
      setTimeout(function() {
        return xhr.set('readyState', 1);
      });
      return false;
    });
    return xhr.onCall('send', function() {
      var frame, p;
      p = parseUrl(xhr.url);
      if (!(p && slaves[p.origin])) {
        return;
      }
      frame = new Frame(p.origin, slaves[p.origin]);
      frame.send(xhr.serialize(), function(res) {
        return xhr.deserialize(res);
      });
      return false;
    });
  });
};

Frame = (function() {
  Frame.prototype.frames = {};

  function Frame(origin, proxyPath) {
    this.origin = origin;
    this.proxyPath = proxyPath;
    if (this.frames[this.origin]) {
      return this.frames[this.origin];
    }
    this.frames[this.origin] = this;
    this.listeners = {};
    this.frame = document.createElement("iframe");
    this.frame.id = this.frame.name = 'xdomain-' + guid();
    this.frame.src = this.origin + this.proxyPath;
    this.frame.setAttribute('style', 'display:none;');
    document.body.appendChild(this.frame);
    this.waits = 0;
    this.ready = false;
  }

  Frame.prototype.post = function(msg) {
    return this.frame.contentWindow.postMessage(msg, this.origin);
  };

  Frame.prototype.listen = function(id, callback) {
    if (this.listeners[id]) {
      throw "already listening for: " + id;
    }
    return this.listeners[id] = callback;
  };

  Frame.prototype.unlisten = function(id) {
    return delete this.listeners[id];
  };

  Frame.prototype.recieve = function(event) {
    var cb, message;
    if (event.data === PING) {
      this.ready = true;
      return;
    }
    message = getMessage(event.data);
    cb = this.listeners[message.id];
    if (!cb) {
      warn("unkown message (" + message.id + ")");
      return;
    }
    this.unlisten(message.id);
    return cb(message.res);
  };

  Frame.prototype.send = function(req, callback) {
    var _this = this;
    return this.readyCheck(function() {
      var id;
      id = guid();
      _this.listen(id, function(data) {
        return callback(data);
      });
      return _this.post(setMessage({
        id: id,
        req: req
      }));
    });
  };

  Frame.prototype.readyCheck = function(callback) {
    var _this = this;
    if (this.ready === true) {
      return callback();
    }
    if (this.waits++ >= 100) {
      throw "Timeout connecting to iframe: " + this.origin;
    }
    return setTimeout(function() {
      return _this.readyCheck(callback);
    }, 100);
  };

  return Frame;

})();

window.xdomain = function(o) {
  if (!o) {
    return;
  }
  if (o.masters) {
    setupSlave(o.masters);
  }
  if (o.slaves) {
    return setupMaster(o.slaves);
  }
};

xdomain.origin = currentOrigin;

_ref1 = document.getElementsByTagName("script");
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  script = _ref1[_j];
  if (/xdomain/.test(script.src)) {
    if (script.hasAttribute('slave')) {
      p = parseUrl(script.getAttribute('slave'));
      if (!p) {
        return;
      }
      slaves = {};
      slaves[p.origin] = p.path;
      xdomain({
        slaves: slaves
      });
    }
    if (script.hasAttribute('master')) {
      masters = {};
      masters[script.getAttribute('master')] = /./;
      xdomain({
        masters: masters
      });
    }
  }
}
}(window,document));
var ACCESS_KEY, SECRET_KEY, ajax, config, e, endpoints, hash, slaves;

ACCESS_KEY = 'accessKeyId';

SECRET_KEY = 'secretAccessKey';

slaves = {
  "https://s3.amazonaws.com": "/jpillora-usa/proxy.html",
  "https://s3-ap-southeast-2.amazonaws.com": "/jpillora-aus/proxy.html"
};

xdomain({
  slaves: slaves
});

endpoints = [];

for (e in slaves) {
  endpoints.push(e);
}

config = {};

hashing.hmac_hash = hashing.sha1;

hash = function(key, str) {
  return encoding.base64_encode(encoding.hstr2astr(hashing.HMAC(key, str)));
};

ajax = function(opts, callback) {
  var amz, auth, body, date, header, headers, message, method, path, setHeader, type, url, value, xhr, _ref;
  if (callback == null) {
    callback = function() {};
  }
  if (!config[ACCESS_KEY]) {
    throw "NO AWS ACCESS SET";
  }
  if (!config[SECRET_KEY]) {
    throw "NO AWS SECRET SET";
  }
  auth = "AWS " + config[ACCESS_KEY] + ":";
  method = opts.method || 'GET';
  url = opts.url || '';
  path = url.replace(/https?\:\/\/[^\/]+/, '');
  if (method !== 'GET') {
    type = 'text/plain; charset=UTF-8';
  }
  if (opts.type) {
    type = opts.type;
  }
  date = new Date().toUTCString();
  body = opts.body;
  xhr = new XMLHttpRequest();
  xhr.open(method, url);
  amz = [];
  headers = {};
  setHeader = function(header, val) {
    xhr.setRequestHeader(header, val);
    if (/^x-amz/i.test(header)) {
      amz.push(header.toLowerCase() + ":" + val);
    }
    return headers[header] = val;
  };
  if (type) {
    setHeader('Content-Type', type);
  }
  setHeader('x-amz-date', date);
  _ref = opts.headers;
  for (header in _ref) {
    value = _ref[header];
    setHeader(header, value);
  }
  message = [method, "", type, "", amz.join("\n"), path].join("\n");
  setHeader("Authorization", auth + hash(config[SECRET_KEY], message));
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      return callback({
        status: xhr.status,
        requestHeaders: headers,
        responseHeaders: xhook.headers(xhr.getAllResponseHeaders()),
        responseText: xhr.responseText
      });
    }
  };
  return xhr.send(body);
};

window.S3 = {
  endpoints: endpoints,
  set: function(obj) {
    var k, v, _results;
    _results = [];
    for (k in obj) {
      v = obj[k];
      _results.push(config[k] = v);
    }
    return _results;
  },
  getObject: function(url, callback) {
    return ajax({
      method: "GET",
      url: url
    }, callback);
  },
  putObject: function(url, val, callback) {
    return ajax({
      method: "PUT",
      url: url,
      body: val
    }, callback);
  }
};
}(window,document));