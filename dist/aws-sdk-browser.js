// Unofficial AWS SDK for the Browser - v0.1.0 - https://github.com/jpillora/aws-sdk-browser
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


MIME_TYPES = {
  nef: 'image/x-nikon-nef',
  dng: 'image/x-adobe-dng',
  '123': 'application/vnd.lotus-1-2-3',
  ez: 'application/andrew-inset',
  aw: 'application/applixware',
  atom: 'application/atom+xml',
  atomcat: 'application/atomcat+xml',
  atomsvc: 'application/atomsvc+xml',
  ccxml: 'application/ccxml+xml',
  cdmia: 'application/cdmi-capability',
  cdmic: 'application/cdmi-container',
  cdmid: 'application/cdmi-domain',
  cdmio: 'application/cdmi-object',
  cdmiq: 'application/cdmi-queue',
  cu: 'application/cu-seeme',
  davmount: 'application/davmount+xml',
  dbk: 'application/docbook+xml',
  dssc: 'application/dssc+der',
  xdssc: 'application/dssc+xml',
  ecma: 'application/ecmascript',
  emma: 'application/emma+xml',
  epub: 'application/epub+zip',
  exi: 'application/exi',
  pfr: 'application/font-tdpfr',
  gml: 'application/gml+xml',
  gpx: 'application/gpx+xml',
  gxf: 'application/gxf',
  stk: 'application/hyperstudio',
  ink: 'application/inkml+xml',
  inkml: 'application/inkml+xml',
  ipfix: 'application/ipfix',
  jar: 'application/java-archive',
  ser: 'application/java-serialized-object',
  class: 'application/java-vm',
  js: 'application/javascript',
  json: 'application/json',
  jsonml: 'application/jsonml+json',
  lostxml: 'application/lost+xml',
  hqx: 'application/mac-binhex40',
  cpt: 'application/mac-compactpro',
  mads: 'application/mads+xml',
  mrc: 'application/marc',
  mrcx: 'application/marcxml+xml',
  ma: 'application/mathematica',
  nb: 'application/mathematica',
  mb: 'application/mathematica',
  mathml: 'application/mathml+xml',
  mbox: 'application/mbox',
  mscml: 'application/mediaservercontrol+xml',
  metalink: 'application/metalink+xml',
  meta4: 'application/metalink4+xml',
  mets: 'application/mets+xml',
  mods: 'application/mods+xml',
  m21: 'application/mp21',
  mp21: 'application/mp21',
  mp4s: 'application/mp4',
  doc: 'application/msword',
  dot: 'application/msword',
  mxf: 'application/mxf',
  bin: 'application/octet-stream',
  dms: 'application/octet-stream',
  lrf: 'application/octet-stream',
  mar: 'application/octet-stream',
  so: 'application/octet-stream',
  dist: 'application/octet-stream',
  distz: 'application/octet-stream',
  pkg: 'application/octet-stream',
  bpk: 'application/octet-stream',
  dump: 'application/octet-stream',
  elc: 'application/octet-stream',
  deploy: 'application/octet-stream',
  oda: 'application/oda',
  opf: 'application/oebps-package+xml',
  ogx: 'application/ogg',
  omdoc: 'application/omdoc+xml',
  onetoc: 'application/onenote',
  onetoc2: 'application/onenote',
  onetmp: 'application/onenote',
  onepkg: 'application/onenote',
  oxps: 'application/oxps',
  xer: 'application/patch-ops-error+xml',
  pdf: 'application/pdf',
  pgp: 'application/pgp-encrypted',
  asc: 'application/pgp-signature',
  sig: 'application/pgp-signature',
  prf: 'application/pics-rules',
  p10: 'application/pkcs10',
  p7m: 'application/pkcs7-mime',
  p7c: 'application/pkcs7-mime',
  p7s: 'application/pkcs7-signature',
  p8: 'application/pkcs8',
  ac: 'application/pkix-attr-cert',
  cer: 'application/pkix-cert',
  crl: 'application/pkix-crl',
  pkipath: 'application/pkix-pkipath',
  pki: 'application/pkixcmp',
  pls: 'application/pls+xml',
  ai: 'application/postscript',
  eps: 'application/postscript',
  ps: 'application/postscript',
  cww: 'application/prs.cww',
  pskcxml: 'application/pskc+xml',
  rdf: 'application/rdf+xml',
  rif: 'application/reginfo+xml',
  rnc: 'application/relax-ng-compact-syntax',
  rl: 'application/resource-lists+xml',
  rld: 'application/resource-lists-diff+xml',
  rs: 'application/rls-services+xml',
  gbr: 'application/rpki-ghostbusters',
  mft: 'application/rpki-manifest',
  roa: 'application/rpki-roa',
  rsd: 'application/rsd+xml',
  rss: 'application/rss+xml',
  rtf: 'application/rtf',
  sbml: 'application/sbml+xml',
  scq: 'application/scvp-cv-request',
  scs: 'application/scvp-cv-response',
  spq: 'application/scvp-vp-request',
  spp: 'application/scvp-vp-response',
  sdp: 'application/sdp',
  setpay: 'application/set-payment-initiation',
  setreg: 'application/set-registration-initiation',
  shf: 'application/shf+xml',
  smi: 'application/smil+xml',
  smil: 'application/smil+xml',
  rq: 'application/sparql-query',
  srx: 'application/sparql-results+xml',
  gram: 'application/srgs',
  grxml: 'application/srgs+xml',
  sru: 'application/sru+xml',
  ssdl: 'application/ssdl+xml',
  ssml: 'application/ssml+xml',
  tei: 'application/tei+xml',
  teicorpus: 'application/tei+xml',
  tfi: 'application/thraud+xml',
  tsd: 'application/timestamped-data',
  plb: 'application/vnd.3gpp.pic-bw-large',
  psb: 'application/vnd.3gpp.pic-bw-small',
  pvb: 'application/vnd.3gpp.pic-bw-var',
  tcap: 'application/vnd.3gpp2.tcap',
  pwn: 'application/vnd.3m.post-it-notes',
  aso: 'application/vnd.accpac.simply.aso',
  imp: 'application/vnd.accpac.simply.imp',
  acu: 'application/vnd.acucobol',
  atc: 'application/vnd.acucorp',
  acutc: 'application/vnd.acucorp',
  air: 'application/vnd.adobe.air-application-installer-package+zip',
  fcdt: 'application/vnd.adobe.formscentral.fcdt',
  fxp: 'application/vnd.adobe.fxp',
  fxpl: 'application/vnd.adobe.fxp',
  xdp: 'application/vnd.adobe.xdp+xml',
  xfdf: 'application/vnd.adobe.xfdf',
  ahead: 'application/vnd.ahead.space',
  azf: 'application/vnd.airzip.filesecure.azf',
  azs: 'application/vnd.airzip.filesecure.azs',
  azw: 'application/vnd.amazon.ebook',
  acc: 'application/vnd.americandynamics.acc',
  ami: 'application/vnd.amiga.ami',
  apk: 'application/vnd.android.package-archive',
  cii: 'application/vnd.anser-web-certificate-issue-initiation',
  fti: 'application/vnd.anser-web-funds-transfer-initiation',
  atx: 'application/vnd.antix.game-component',
  mpkg: 'application/vnd.apple.installer+xml',
  m3u8: 'application/vnd.apple.mpegurl',
  swi: 'application/vnd.aristanetworks.swi',
  iota: 'application/vnd.astraea-software.iota',
  aep: 'application/vnd.audiograph',
  mpm: 'application/vnd.blueice.multipass',
  bmi: 'application/vnd.bmi',
  rep: 'application/vnd.businessobjects',
  cdxml: 'application/vnd.chemdraw+xml',
  mmd: 'application/vnd.chipnuts.karaoke-mmd',
  cdy: 'application/vnd.cinderella',
  cla: 'application/vnd.claymore',
  rp9: 'application/vnd.cloanto.rp9',
  c4g: 'application/vnd.clonk.c4group',
  c4d: 'application/vnd.clonk.c4group',
  c4f: 'application/vnd.clonk.c4group',
  c4p: 'application/vnd.clonk.c4group',
  c4u: 'application/vnd.clonk.c4group',
  c11amc: 'application/vnd.cluetrust.cartomobile-config',
  c11amz: 'application/vnd.cluetrust.cartomobile-config-pkg',
  csp: 'application/vnd.commonspace',
  cdbcmsg: 'application/vnd.contact.cmsg',
  cmc: 'application/vnd.cosmocaller',
  clkx: 'application/vnd.crick.clicker',
  clkk: 'application/vnd.crick.clicker.keyboard',
  clkp: 'application/vnd.crick.clicker.palette',
  clkt: 'application/vnd.crick.clicker.template',
  clkw: 'application/vnd.crick.clicker.wordbank',
  wbs: 'application/vnd.criticaltools.wbs+xml',
  pml: 'application/vnd.ctc-posml',
  ppd: 'application/vnd.cups-ppd',
  car: 'application/vnd.curl.car',
  pcurl: 'application/vnd.curl.pcurl',
  dart: 'application/vnd.dart',
  rdz: 'application/vnd.data-vision.rdz',
  uvf: 'application/vnd.dece.data',
  uvvf: 'application/vnd.dece.data',
  uvd: 'application/vnd.dece.data',
  uvvd: 'application/vnd.dece.data',
  uvt: 'application/vnd.dece.ttml+xml',
  uvvt: 'application/vnd.dece.ttml+xml',
  uvx: 'application/vnd.dece.unspecified',
  uvvx: 'application/vnd.dece.unspecified',
  uvz: 'application/vnd.dece.zip',
  uvvz: 'application/vnd.dece.zip',
  fe_launch: 'application/vnd.denovo.fcselayout-link',
  dna: 'application/vnd.dna',
  mlp: 'application/vnd.dolby.mlp',
  dpg: 'application/vnd.dpgraph',
  dfac: 'application/vnd.dreamfactory',
  kpxx: 'application/vnd.ds-keypoint',
  ait: 'application/vnd.dvb.ait',
  svc: 'application/vnd.dvb.service',
  geo: 'application/vnd.dynageo',
  mag: 'application/vnd.ecowin.chart',
  nml: 'application/vnd.enliven',
  esf: 'application/vnd.epson.esf',
  msf: 'application/vnd.epson.msf',
  qam: 'application/vnd.epson.quickanime',
  slt: 'application/vnd.epson.salt',
  ssf: 'application/vnd.epson.ssf',
  es3: 'application/vnd.eszigno3+xml',
  et3: 'application/vnd.eszigno3+xml',
  ez2: 'application/vnd.ezpix-album',
  ez3: 'application/vnd.ezpix-package',
  fdf: 'application/vnd.fdf',
  mseed: 'application/vnd.fdsn.mseed',
  seed: 'application/vnd.fdsn.seed',
  dataless: 'application/vnd.fdsn.seed',
  gph: 'application/vnd.flographit',
  ftc: 'application/vnd.fluxtime.clip',
  fm: 'application/vnd.framemaker',
  frame: 'application/vnd.framemaker',
  maker: 'application/vnd.framemaker',
  book: 'application/vnd.framemaker',
  fnc: 'application/vnd.frogans.fnc',
  ltf: 'application/vnd.frogans.ltf',
  fsc: 'application/vnd.fsc.weblaunch',
  oas: 'application/vnd.fujitsu.oasys',
  oa2: 'application/vnd.fujitsu.oasys2',
  oa3: 'application/vnd.fujitsu.oasys3',
  fg5: 'application/vnd.fujitsu.oasysgp',
  bh2: 'application/vnd.fujitsu.oasysprs',
  ddd: 'application/vnd.fujixerox.ddd',
  xdw: 'application/vnd.fujixerox.docuworks',
  xbd: 'application/vnd.fujixerox.docuworks.binder',
  fzs: 'application/vnd.fuzzysheet',
  txd: 'application/vnd.genomatix.tuxedo',
  ggb: 'application/vnd.geogebra.file',
  ggt: 'application/vnd.geogebra.tool',
  gex: 'application/vnd.geometry-explorer',
  gre: 'application/vnd.geometry-explorer',
  gxt: 'application/vnd.geonext',
  g2w: 'application/vnd.geoplan',
  g3w: 'application/vnd.geospace',
  gmx: 'application/vnd.gmx',
  kml: 'application/vnd.google-earth.kml+xml',
  kmz: 'application/vnd.google-earth.kmz',
  gqf: 'application/vnd.grafeq',
  gqs: 'application/vnd.grafeq',
  gac: 'application/vnd.groove-account',
  ghf: 'application/vnd.groove-help',
  gim: 'application/vnd.groove-identity-message',
  grv: 'application/vnd.groove-injector',
  gtm: 'application/vnd.groove-tool-message',
  tpl: 'application/vnd.groove-tool-template',
  vcg: 'application/vnd.groove-vcard',
  hal: 'application/vnd.hal+xml',
  zmm: 'application/vnd.handheld-entertainment+xml',
  hbci: 'application/vnd.hbci',
  les: 'application/vnd.hhe.lesson-player',
  hpgl: 'application/vnd.hp-hpgl',
  hpid: 'application/vnd.hp-hpid',
  hps: 'application/vnd.hp-hps',
  jlt: 'application/vnd.hp-jlyt',
  pcl: 'application/vnd.hp-pcl',
  pclxl: 'application/vnd.hp-pclxl',
  'sfd-hdstx': 'application/vnd.hydrostatix.sof-data',
  mpy: 'application/vnd.ibm.minipay',
  afp: 'application/vnd.ibm.modcap',
  listafp: 'application/vnd.ibm.modcap',
  list3820: 'application/vnd.ibm.modcap',
  irm: 'application/vnd.ibm.rights-management',
  sc: 'application/vnd.ibm.secure-container',
  icc: 'application/vnd.iccprofile',
  icm: 'application/vnd.iccprofile',
  igl: 'application/vnd.igloader',
  ivp: 'application/vnd.immervision-ivp',
  ivu: 'application/vnd.immervision-ivu',
  igm: 'application/vnd.insors.igm',
  xpw: 'application/vnd.intercon.formnet',
  xpx: 'application/vnd.intercon.formnet',
  i2g: 'application/vnd.intergeo',
  qbo: 'application/vnd.intu.qbo',
  qfx: 'application/vnd.intu.qfx',
  rcprofile: 'application/vnd.ipunplugged.rcprofile',
  irp: 'application/vnd.irepository.package+xml',
  xpr: 'application/vnd.is-xpr',
  fcs: 'application/vnd.isac.fcs',
  jam: 'application/vnd.jam',
  rms: 'application/vnd.jcp.javame.midlet-rms',
  jisp: 'application/vnd.jisp',
  joda: 'application/vnd.joost.joda-archive',
  ktz: 'application/vnd.kahootz',
  ktr: 'application/vnd.kahootz',
  karbon: 'application/vnd.kde.karbon',
  chrt: 'application/vnd.kde.kchart',
  kfo: 'application/vnd.kde.kformula',
  flw: 'application/vnd.kde.kivio',
  kon: 'application/vnd.kde.kontour',
  kpr: 'application/vnd.kde.kpresenter',
  kpt: 'application/vnd.kde.kpresenter',
  ksp: 'application/vnd.kde.kspread',
  kwd: 'application/vnd.kde.kword',
  kwt: 'application/vnd.kde.kword',
  htke: 'application/vnd.kenameaapp',
  kia: 'application/vnd.kidspiration',
  kne: 'application/vnd.kinar',
  knp: 'application/vnd.kinar',
  skp: 'application/vnd.koan',
  skd: 'application/vnd.koan',
  skt: 'application/vnd.koan',
  skm: 'application/vnd.koan',
  sse: 'application/vnd.kodak-descriptor',
  lasxml: 'application/vnd.las.las+xml',
  lbd: 'application/vnd.llamagraphics.life-balance.desktop',
  lbe: 'application/vnd.llamagraphics.life-balance.exchange+xml',
  apr: 'application/vnd.lotus-approach',
  pre: 'application/vnd.lotus-freelance',
  nsf: 'application/vnd.lotus-notes',
  org: 'application/vnd.lotus-organizer',
  scm: 'application/vnd.lotus-screencam',
  lwp: 'application/vnd.lotus-wordpro',
  portpkg: 'application/vnd.macports.portpkg',
  mcd: 'application/vnd.mcd',
  mc1: 'application/vnd.medcalcdata',
  cdkey: 'application/vnd.mediastation.cdkey',
  mwf: 'application/vnd.mfer',
  mfm: 'application/vnd.mfmp',
  flo: 'application/vnd.micrografx.flo',
  igx: 'application/vnd.micrografx.igx',
  mif: 'application/vnd.mif',
  daf: 'application/vnd.mobius.daf',
  dis: 'application/vnd.mobius.dis',
  mbk: 'application/vnd.mobius.mbk',
  mqy: 'application/vnd.mobius.mqy',
  msl: 'application/vnd.mobius.msl',
  plc: 'application/vnd.mobius.plc',
  txf: 'application/vnd.mobius.txf',
  mpn: 'application/vnd.mophun.application',
  mpc: 'application/vnd.mophun.certificate',
  xul: 'application/vnd.mozilla.xul+xml',
  cil: 'application/vnd.ms-artgalry',
  cab: 'application/vnd.ms-cab-compressed',
  xls: 'application/vnd.ms-excel',
  xlm: 'application/vnd.ms-excel',
  xla: 'application/vnd.ms-excel',
  xlc: 'application/vnd.ms-excel',
  xlt: 'application/vnd.ms-excel',
  xlw: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  eot: 'application/vnd.ms-fontobject',
  chm: 'application/vnd.ms-htmlhelp',
  ims: 'application/vnd.ms-ims',
  lrm: 'application/vnd.ms-lrm',
  thmx: 'application/vnd.ms-officetheme',
  cat: 'application/vnd.ms-pki.seccat',
  stl: 'application/vnd.ms-pki.stl',
  ppt: 'application/vnd.ms-powerpoint',
  pps: 'application/vnd.ms-powerpoint',
  pot: 'application/vnd.ms-powerpoint',
  ppam: 'application/vnd.ms-powerpoint.addin.macroenabled.12',
  pptm: 'application/vnd.ms-powerpoint.presentation.macroenabled.12',
  sldm: 'application/vnd.ms-powerpoint.slide.macroenabled.12',
  ppsm: 'application/vnd.ms-powerpoint.slideshow.macroenabled.12',
  potm: 'application/vnd.ms-powerpoint.template.macroenabled.12',
  mpp: 'application/vnd.ms-project',
  mpt: 'application/vnd.ms-project',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  wps: 'application/vnd.ms-works',
  wks: 'application/vnd.ms-works',
  wcm: 'application/vnd.ms-works',
  wdb: 'application/vnd.ms-works',
  wpl: 'application/vnd.ms-wpl',
  xps: 'application/vnd.ms-xpsdocument',
  mseq: 'application/vnd.mseq',
  mus: 'application/vnd.musician',
  msty: 'application/vnd.muvee.style',
  taglet: 'application/vnd.mynfc',
  nlu: 'application/vnd.neurolanguage.nlu',
  ntf: 'application/vnd.nitf',
  nitf: 'application/vnd.nitf',
  nnd: 'application/vnd.noblenet-directory',
  nns: 'application/vnd.noblenet-sealer',
  nnw: 'application/vnd.noblenet-web',
  ngdat: 'application/vnd.nokia.n-gage.data',
  'n-gage': 'application/vnd.nokia.n-gage.symbian.install',
  rpst: 'application/vnd.nokia.radio-preset',
  rpss: 'application/vnd.nokia.radio-presets',
  edm: 'application/vnd.novadigm.edm',
  edx: 'application/vnd.novadigm.edx',
  ext: 'application/vnd.novadigm.ext',
  odc: 'application/vnd.oasis.opendocument.chart',
  otc: 'application/vnd.oasis.opendocument.chart-template',
  odb: 'application/vnd.oasis.opendocument.database',
  odf: 'application/vnd.oasis.opendocument.formula',
  odft: 'application/vnd.oasis.opendocument.formula-template',
  odg: 'application/vnd.oasis.opendocument.graphics',
  otg: 'application/vnd.oasis.opendocument.graphics-template',
  odi: 'application/vnd.oasis.opendocument.image',
  oti: 'application/vnd.oasis.opendocument.image-template',
  odp: 'application/vnd.oasis.opendocument.presentation',
  otp: 'application/vnd.oasis.opendocument.presentation-template',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  ots: 'application/vnd.oasis.opendocument.spreadsheet-template',
  odt: 'application/vnd.oasis.opendocument.text',
  odm: 'application/vnd.oasis.opendocument.text-master',
  ott: 'application/vnd.oasis.opendocument.text-template',
  oth: 'application/vnd.oasis.opendocument.text-web',
  xo: 'application/vnd.olpc-sugar',
  dd2: 'application/vnd.oma.dd2+xml',
  oxt: 'application/vnd.openofficeorg.extension',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  sldx: 'application/vnd.openxmlformats-officedocument.presentationml.slide',
  ppsx: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  potx: 'application/vnd.openxmlformats-officedocument.presentationml.template',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  mgp: 'application/vnd.osgeo.mapguide.package',
  dp: 'application/vnd.osgi.dp',
  esa: 'application/vnd.osgi.subsystem',
  pdb: 'application/vnd.palm',
  pqa: 'application/vnd.palm',
  oprc: 'application/vnd.palm',
  paw: 'application/vnd.pawaafile',
  str: 'application/vnd.pg.format',
  ei6: 'application/vnd.pg.osasli',
  efif: 'application/vnd.picsel',
  wg: 'application/vnd.pmi.widget',
  plf: 'application/vnd.pocketlearn',
  pbd: 'application/vnd.powerbuilder6',
  box: 'application/vnd.previewsystems.box',
  mgz: 'application/vnd.proteus.magazine',
  qps: 'application/vnd.publishare-delta-tree',
  ptid: 'application/vnd.pvi.ptid1',
  qxd: 'application/vnd.quark.quarkxpress',
  qxt: 'application/vnd.quark.quarkxpress',
  qwd: 'application/vnd.quark.quarkxpress',
  qwt: 'application/vnd.quark.quarkxpress',
  qxl: 'application/vnd.quark.quarkxpress',
  qxb: 'application/vnd.quark.quarkxpress',
  bed: 'application/vnd.realvnc.bed',
  mxl: 'application/vnd.recordare.musicxml',
  musicxml: 'application/vnd.recordare.musicxml+xml',
  cryptonote: 'application/vnd.rig.cryptonote',
  cod: 'application/vnd.rim.cod',
  rm: 'application/vnd.rn-realmedia',
  rmvb: 'application/vnd.rn-realmedia-vbr',
  link66: 'application/vnd.route66.link66+xml',
  st: 'application/vnd.sailingtracker.track',
  see: 'application/vnd.seemail',
  sema: 'application/vnd.sema',
  semd: 'application/vnd.semd',
  semf: 'application/vnd.semf',
  ifm: 'application/vnd.shana.informed.formdata',
  itp: 'application/vnd.shana.informed.formtemplate',
  iif: 'application/vnd.shana.informed.interchange',
  ipk: 'application/vnd.shana.informed.package',
  twd: 'application/vnd.simtech-mindmapper',
  twds: 'application/vnd.simtech-mindmapper',
  mmf: 'application/vnd.smaf',
  teacher: 'application/vnd.smart.teacher',
  sdkm: 'application/vnd.solent.sdkm+xml',
  sdkd: 'application/vnd.solent.sdkm+xml',
  dxp: 'application/vnd.spotfire.dxp',
  sfs: 'application/vnd.spotfire.sfs',
  sdc: 'application/vnd.stardivision.calc',
  sda: 'application/vnd.stardivision.draw',
  sdd: 'application/vnd.stardivision.impress',
  smf: 'application/vnd.stardivision.math',
  sdw: 'application/vnd.stardivision.writer',
  vor: 'application/vnd.stardivision.writer',
  sgl: 'application/vnd.stardivision.writer-global',
  smzip: 'application/vnd.stepmania.package',
  sm: 'application/vnd.stepmania.stepchart',
  sxc: 'application/vnd.sun.xml.calc',
  stc: 'application/vnd.sun.xml.calc.template',
  sxd: 'application/vnd.sun.xml.draw',
  std: 'application/vnd.sun.xml.draw.template',
  sxi: 'application/vnd.sun.xml.impress',
  sti: 'application/vnd.sun.xml.impress.template',
  sxm: 'application/vnd.sun.xml.math',
  sxw: 'application/vnd.sun.xml.writer',
  sxg: 'application/vnd.sun.xml.writer.global',
  stw: 'application/vnd.sun.xml.writer.template',
  sus: 'application/vnd.sus-calendar',
  susp: 'application/vnd.sus-calendar',
  svd: 'application/vnd.svd',
  sis: 'application/vnd.symbian.install',
  sisx: 'application/vnd.symbian.install',
  xsm: 'application/vnd.syncml+xml',
  bdm: 'application/vnd.syncml.dm+wbxml',
  xdm: 'application/vnd.syncml.dm+xml',
  tao: 'application/vnd.tao.intent-module-archive',
  pcap: 'application/vnd.tcpdump.pcap',
  cap: 'application/vnd.tcpdump.pcap',
  dmp: 'application/vnd.tcpdump.pcap',
  tmo: 'application/vnd.tmobile-livetv',
  tpt: 'application/vnd.trid.tpt',
  mxs: 'application/vnd.triscape.mxs',
  tra: 'application/vnd.trueapp',
  ufd: 'application/vnd.ufdl',
  ufdl: 'application/vnd.ufdl',
  utz: 'application/vnd.uiq.theme',
  umj: 'application/vnd.umajin',
  unityweb: 'application/vnd.unity',
  uoml: 'application/vnd.uoml+xml',
  vcx: 'application/vnd.vcx',
  vsd: 'application/vnd.visio',
  vst: 'application/vnd.visio',
  vss: 'application/vnd.visio',
  vsw: 'application/vnd.visio',
  vis: 'application/vnd.visionary',
  vsf: 'application/vnd.vsf',
  wbxml: 'application/vnd.wap.wbxml',
  wmlc: 'application/vnd.wap.wmlc',
  wmlsc: 'application/vnd.wap.wmlscriptc',
  wtb: 'application/vnd.webturbo',
  nbp: 'application/vnd.wolfram.player',
  wpd: 'application/vnd.wordperfect',
  wqd: 'application/vnd.wqd',
  stf: 'application/vnd.wt.stf',
  xar: 'application/vnd.xara',
  xfdl: 'application/vnd.xfdl',
  hvd: 'application/vnd.yamaha.hv-dic',
  hvs: 'application/vnd.yamaha.hv-script',
  hvp: 'application/vnd.yamaha.hv-voice',
  osf: 'application/vnd.yamaha.openscoreformat',
  osfpvg: 'application/vnd.yamaha.openscoreformat.osfpvg+xml',
  saf: 'application/vnd.yamaha.smaf-audio',
  spf: 'application/vnd.yamaha.smaf-phrase',
  cmp: 'application/vnd.yellowriver-custom-menu',
  zir: 'application/vnd.zul',
  zirz: 'application/vnd.zul',
  zaz: 'application/vnd.zzazz.deck+xml',
  vxml: 'application/voicexml+xml',
  wgt: 'application/widget',
  hlp: 'application/winhlp',
  wsdl: 'application/wsdl+xml',
  wspolicy: 'application/wspolicy+xml',
  '7z': 'application/x-7z-compressed',
  abw: 'application/x-abiword',
  ace: 'application/x-ace-compressed',
  dmg: 'application/x-apple-diskimage',
  aab: 'application/x-authorware-bin',
  x32: 'application/x-authorware-bin',
  u32: 'application/x-authorware-bin',
  vox: 'application/x-authorware-bin',
  aam: 'application/x-authorware-map',
  aas: 'application/x-authorware-seg',
  bcpio: 'application/x-bcpio',
  torrent: 'application/x-bittorrent',
  blb: 'application/x-blorb',
  blorb: 'application/x-blorb',
  bz: 'application/x-bzip',
  bz2: 'application/x-bzip2',
  boz: 'application/x-bzip2',
  cbr: 'application/x-cbr',
  cba: 'application/x-cbr',
  cbt: 'application/x-cbr',
  cbz: 'application/x-cbr',
  cb7: 'application/x-cbr',
  vcd: 'application/x-cdlink',
  cfs: 'application/x-cfs-compressed',
  chat: 'application/x-chat',
  pgn: 'application/x-chess-pgn',
  nsc: 'application/x-conference',
  cpio: 'application/x-cpio',
  csh: 'application/x-csh',
  deb: 'application/x-debian-package',
  udeb: 'application/x-debian-package',
  dgc: 'application/x-dgc-compressed',
  dir: 'application/x-director',
  dcr: 'application/x-director',
  dxr: 'application/x-director',
  cst: 'application/x-director',
  cct: 'application/x-director',
  cxt: 'application/x-director',
  w3d: 'application/x-director',
  fgd: 'application/x-director',
  swa: 'application/x-director',
  wad: 'application/x-doom',
  ncx: 'application/x-dtbncx+xml',
  dtb: 'application/x-dtbook+xml',
  res: 'application/x-dtbresource+xml',
  dvi: 'application/x-dvi',
  evy: 'application/x-envoy',
  eva: 'application/x-eva',
  bdf: 'application/x-font-bdf',
  gsf: 'application/x-font-ghostscript',
  psf: 'application/x-font-linux-psf',
  otf: 'application/x-font-otf',
  pcf: 'application/x-font-pcf',
  snf: 'application/x-font-snf',
  ttf: 'application/x-font-ttf',
  ttc: 'application/x-font-ttf',
  pfa: 'application/x-font-type1',
  pfb: 'application/x-font-type1',
  pfm: 'application/x-font-type1',
  afm: 'application/x-font-type1',
  woff: 'application/x-font-woff',
  arc: 'application/x-freearc',
  spl: 'application/x-futuresplash',
  gca: 'application/x-gca-compressed',
  ulx: 'application/x-glulx',
  gnumeric: 'application/x-gnumeric',
  gramps: 'application/x-gramps-xml',
  gtar: 'application/x-gtar',
  hdf: 'application/x-hdf',
  install: 'application/x-install-instructions',
  iso: 'application/x-iso9660-image',
  jnlp: 'application/x-java-jnlp-file',
  latex: 'application/x-latex',
  lzh: 'application/x-lzh-compressed',
  lha: 'application/x-lzh-compressed',
  mie: 'application/x-mie',
  prc: 'application/x-mobipocket-ebook',
  mobi: 'application/x-mobipocket-ebook',
  application: 'application/x-ms-application',
  lnk: 'application/x-ms-shortcut',
  wmd: 'application/x-ms-wmd',
  wmz: 'application/x-msmetafile',
  xbap: 'application/x-ms-xbap',
  mdb: 'application/x-msaccess',
  obd: 'application/x-msbinder',
  crd: 'application/x-mscardfile',
  clp: 'application/x-msclip',
  exe: 'application/x-msdownload',
  dll: 'application/x-msdownload',
  com: 'application/x-msdownload',
  bat: 'application/x-msdownload',
  msi: 'application/x-msdownload',
  mvb: 'application/x-msmediaview',
  m13: 'application/x-msmediaview',
  m14: 'application/x-msmediaview',
  wmf: 'application/x-msmetafile',
  emf: 'application/x-msmetafile',
  emz: 'application/x-msmetafile',
  mny: 'application/x-msmoney',
  pub: 'application/x-mspublisher',
  scd: 'application/x-msschedule',
  trm: 'application/x-msterminal',
  wri: 'application/x-mswrite',
  nc: 'application/x-netcdf',
  cdf: 'application/x-netcdf',
  nzb: 'application/x-nzb',
  p12: 'application/x-pkcs12',
  pfx: 'application/x-pkcs12',
  p7b: 'application/x-pkcs7-certificates',
  spc: 'application/x-pkcs7-certificates',
  p7r: 'application/x-pkcs7-certreqresp',
  rar: 'application/x-rar-compressed',
  ris: 'application/x-research-info-systems',
  sh: 'application/x-sh',
  shar: 'application/x-shar',
  swf: 'application/x-shockwave-flash',
  xap: 'application/x-silverlight-app',
  sql: 'application/x-sql',
  sit: 'application/x-stuffit',
  sitx: 'application/x-stuffitx',
  srt: 'application/x-subrip',
  sv4cpio: 'application/x-sv4cpio',
  sv4crc: 'application/x-sv4crc',
  t3: 'application/x-t3vm-image',
  gam: 'application/x-tads',
  tar: 'application/x-tar',
  tcl: 'application/x-tcl',
  tex: 'application/x-tex',
  tfm: 'application/x-tex-tfm',
  texinfo: 'application/x-texinfo',
  texi: 'application/x-texinfo',
  obj: 'application/x-tgif',
  ustar: 'application/x-ustar',
  src: 'application/x-wais-source',
  der: 'application/x-x509-ca-cert',
  crt: 'application/x-x509-ca-cert',
  fig: 'application/x-xfig',
  xlf: 'application/x-xliff+xml',
  xpi: 'application/x-xpinstall',
  xz: 'application/x-xz',
  z1: 'application/x-zmachine',
  z2: 'application/x-zmachine',
  z3: 'application/x-zmachine',
  z4: 'application/x-zmachine',
  z5: 'application/x-zmachine',
  z6: 'application/x-zmachine',
  z7: 'application/x-zmachine',
  z8: 'application/x-zmachine',
  xaml: 'application/xaml+xml',
  xdf: 'application/xcap-diff+xml',
  xenc: 'application/xenc+xml',
  xhtml: 'application/xhtml+xml',
  xht: 'application/xhtml+xml',
  xml: 'application/xml',
  xsl: 'application/xml',
  dtd: 'application/xml-dtd',
  xop: 'application/xop+xml',
  xpl: 'application/xproc+xml',
  xslt: 'application/xslt+xml',
  xspf: 'application/xspf+xml',
  mxml: 'application/xv+xml',
  xhvml: 'application/xv+xml',
  xvml: 'application/xv+xml',
  xvm: 'application/xv+xml',
  yang: 'application/yang',
  yin: 'application/yin+xml',
  zip: 'application/zip',
  adp: 'audio/adpcm',
  au: 'audio/basic',
  snd: 'audio/basic',
  mid: 'audio/midi',
  midi: 'audio/midi',
  kar: 'audio/midi',
  rmi: 'audio/midi',
  mp4a: 'audio/mp4',
  mpga: 'audio/mpeg',
  mp2: 'audio/mpeg',
  mp2a: 'audio/mpeg',
  mp3: 'audio/mpeg',
  m2a: 'audio/mpeg',
  m3a: 'audio/mpeg',
  oga: 'audio/ogg',
  ogg: 'audio/ogg',
  spx: 'audio/ogg',
  s3m: 'audio/s3m',
  sil: 'audio/silk',
  uva: 'audio/vnd.dece.audio',
  uvva: 'audio/vnd.dece.audio',
  eol: 'audio/vnd.digital-winds',
  dra: 'audio/vnd.dra',
  dts: 'audio/vnd.dts',
  dtshd: 'audio/vnd.dts.hd',
  lvp: 'audio/vnd.lucent.voice',
  pya: 'audio/vnd.ms-playready.media.pya',
  ecelp4800: 'audio/vnd.nuera.ecelp4800',
  ecelp7470: 'audio/vnd.nuera.ecelp7470',
  ecelp9600: 'audio/vnd.nuera.ecelp9600',
  rip: 'audio/vnd.rip',
  weba: 'audio/webm',
  aac: 'audio/x-aac',
  aif: 'audio/x-aiff',
  aiff: 'audio/x-aiff',
  aifc: 'audio/x-aiff',
  caf: 'audio/x-caf',
  flac: 'audio/x-flac',
  mka: 'audio/x-matroska',
  m3u: 'audio/x-mpegurl',
  wax: 'audio/x-ms-wax',
  wma: 'audio/x-ms-wma',
  ram: 'audio/x-pn-realaudio',
  ra: 'audio/x-pn-realaudio',
  rmp: 'audio/x-pn-realaudio-plugin',
  wav: 'audio/x-wav',
  xm: 'audio/xm',
  cdx: 'chemical/x-cdx',
  cif: 'chemical/x-cif',
  cmdf: 'chemical/x-cmdf',
  cml: 'chemical/x-cml',
  csml: 'chemical/x-csml',
  xyz: 'chemical/x-xyz',
  bmp: 'image/bmp',
  cgm: 'image/cgm',
  g3: 'image/g3fax',
  gif: 'image/gif',
  ief: 'image/ief',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  jpe: 'image/jpeg',
  ktx: 'image/ktx',
  png: 'image/png',
  btif: 'image/prs.btif',
  sgi: 'image/sgi',
  svg: 'image/svg+xml',
  svgz: 'image/svg+xml',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  psd: 'image/vnd.adobe.photoshop',
  uvi: 'image/vnd.dece.graphic',
  uvvi: 'image/vnd.dece.graphic',
  uvg: 'image/vnd.dece.graphic',
  uvvg: 'image/vnd.dece.graphic',
  sub: 'text/vnd.dvb.subtitle',
  djvu: 'image/vnd.djvu',
  djv: 'image/vnd.djvu',
  dwg: 'image/vnd.dwg',
  dxf: 'image/vnd.dxf',
  fbs: 'image/vnd.fastbidsheet',
  fpx: 'image/vnd.fpx',
  fst: 'image/vnd.fst',
  mmr: 'image/vnd.fujixerox.edmics-mmr',
  rlc: 'image/vnd.fujixerox.edmics-rlc',
  mdi: 'image/vnd.ms-modi',
  wdp: 'image/vnd.ms-photo',
  npx: 'image/vnd.net-fpx',
  wbmp: 'image/vnd.wap.wbmp',
  xif: 'image/vnd.xiff',
  webp: 'image/webp',
  '3ds': 'image/x-3ds',
  ras: 'image/x-cmu-raster',
  cmx: 'image/x-cmx',
  fh: 'image/x-freehand',
  fhc: 'image/x-freehand',
  fh4: 'image/x-freehand',
  fh5: 'image/x-freehand',
  fh7: 'image/x-freehand',
  ico: 'image/x-icon',
  sid: 'image/x-mrsid-image',
  pcx: 'image/x-pcx',
  pic: 'image/x-pict',
  pct: 'image/x-pict',
  pnm: 'image/x-portable-anymap',
  pbm: 'image/x-portable-bitmap',
  pgm: 'image/x-portable-graymap',
  ppm: 'image/x-portable-pixmap',
  rgb: 'image/x-rgb',
  tga: 'image/x-tga',
  xbm: 'image/x-xbitmap',
  xpm: 'image/x-xpixmap',
  xwd: 'image/x-xwindowdump',
  eml: 'message/rfc822',
  mime: 'message/rfc822',
  igs: 'model/iges',
  iges: 'model/iges',
  msh: 'model/mesh',
  mesh: 'model/mesh',
  silo: 'model/mesh',
  dae: 'model/vnd.collada+xml',
  dwf: 'model/vnd.dwf',
  gdl: 'model/vnd.gdl',
  gtw: 'model/vnd.gtw',
  mts: 'model/vnd.mts',
  vtu: 'model/vnd.vtu',
  wrl: 'model/vrml',
  vrml: 'model/vrml',
  x3db: 'model/x3d+binary',
  x3dbz: 'model/x3d+binary',
  x3dv: 'model/x3d+vrml',
  x3dvz: 'model/x3d+vrml',
  x3d: 'model/x3d+xml',
  x3dz: 'model/x3d+xml',
  appcache: 'text/cache-manifest',
  ics: 'text/calendar',
  ifb: 'text/calendar',
  css: 'text/css',
  csv: 'text/csv',
  html: 'text/html',
  htm: 'text/html',
  n3: 'text/n3',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  def: 'text/plain',
  list: 'text/plain',
  log: 'text/plain',
  in : 'text/plain',
  dsc: 'text/prs.lines.tag',
  rtx: 'text/richtext',
  sgml: 'text/sgml',
  sgm: 'text/sgml',
  tsv: 'text/tab-separated-values',
  t: 'text/troff',
  tr: 'text/troff',
  roff: 'text/troff',
  man: 'text/troff',
  me: 'text/troff',
  ms: 'text/troff',
  ttl: 'text/turtle',
  uri: 'text/uri-list',
  uris: 'text/uri-list',
  urls: 'text/uri-list',
  vcard: 'text/vcard',
  curl: 'text/vnd.curl',
  dcurl: 'text/vnd.curl.dcurl',
  scurl: 'text/vnd.curl.scurl',
  mcurl: 'text/vnd.curl.mcurl',
  fly: 'text/vnd.fly',
  flx: 'text/vnd.fmi.flexstor',
  gv: 'text/vnd.graphviz',
  '3dml': 'text/vnd.in3d.3dml',
  spot: 'text/vnd.in3d.spot',
  jad: 'text/vnd.sun.j2me.app-descriptor',
  wml: 'text/vnd.wap.wml',
  wmls: 'text/vnd.wap.wmlscript',
  s: 'text/x-asm',
  asm: 'text/x-asm',
  c: 'text/x-c',
  cc: 'text/x-c',
  cxx: 'text/x-c',
  cpp: 'text/x-c',
  h: 'text/x-c',
  hh: 'text/x-c',
  dic: 'text/x-c',
  f: 'text/x-fortran',
  for: 'text/x-fortran',
  f77: 'text/x-fortran',
  f90: 'text/x-fortran',
  java: 'text/x-java-source',
  opml: 'text/x-opml',
  p: 'text/x-pascal',
  pas: 'text/x-pascal',
  nfo: 'text/x-nfo',
  etx: 'text/x-setext',
  sfv: 'text/x-sfv',
  uu: 'text/x-uuencode',
  vcs: 'text/x-vcalendar',
  vcf: 'text/x-vcard',
  '3gp': 'video/3gpp',
  '3g2': 'video/3gpp2',
  h261: 'video/h261',
  h263: 'video/h263',
  h264: 'video/h264',
  jpgv: 'video/jpeg',
  jpm: 'video/jpm',
  jpgm: 'video/jpm',
  mj2: 'video/mj2',
  mjp2: 'video/mj2',
  mp4: 'video/mp4',
  mp4v: 'video/mp4',
  mpg4: 'video/mp4',
  mpeg: 'video/mpeg',
  mpg: 'video/mpeg',
  mpe: 'video/mpeg',
  m1v: 'video/mpeg',
  m2v: 'video/mpeg',
  ogv: 'video/ogg',
  qt: 'video/quicktime',
  mov: 'video/quicktime',
  uvh: 'video/vnd.dece.hd',
  uvvh: 'video/vnd.dece.hd',
  uvm: 'video/vnd.dece.mobile',
  uvvm: 'video/vnd.dece.mobile',
  uvp: 'video/vnd.dece.pd',
  uvvp: 'video/vnd.dece.pd',
  uvs: 'video/vnd.dece.sd',
  uvvs: 'video/vnd.dece.sd',
  uvv: 'video/vnd.dece.video',
  uvvv: 'video/vnd.dece.video',
  dvb: 'video/vnd.dvb.file',
  fvt: 'video/vnd.fvt',
  mxu: 'video/vnd.mpegurl',
  m4u: 'video/vnd.mpegurl',
  pyv: 'video/vnd.ms-playready.media.pyv',
  uvu: 'video/vnd.uvvu.mp4',
  uvvu: 'video/vnd.uvvu.mp4',
  viv: 'video/vnd.vivo',
  webm: 'video/webm',
  f4v: 'video/x-f4v',
  fli: 'video/x-fli',
  flv: 'video/x-flv',
  m4v: 'video/x-m4v',
  mkv: 'video/x-matroska',
  mk3d: 'video/x-matroska',
  mks: 'video/x-matroska',
  mng: 'video/x-mng',
  asf: 'video/x-ms-asf',
  asx: 'video/x-ms-asf',
  vob: 'video/x-ms-vob',
  wm: 'video/x-ms-wm',
  wmv: 'video/x-ms-wmv',
  wmx: 'video/x-ms-wmx',
  wvx: 'video/x-ms-wvx',
  avi: 'video/x-msvideo',
  movie: 'video/x-sgi-movie',
  smv: 'video/x-smv',
  ice: 'x-conference/x-cooltalk'
};
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
  type = method !== 'GET' && /\.(\w+)$/.test(path) ? MIME_TYPES[RegExp.$1] : '';
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
  message = [method, "", type, "", amz.join("\n"), path].join("\n");
  _ref = opts.headers;
  for (header in _ref) {
    value = _ref[header];
    setHeader(header, value);
  }
  setHeader("Authorization", auth + hash(config[SECRET_KEY], message));
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      return callback({
        url: url,
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