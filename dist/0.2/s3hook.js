// S3 Hook - v0.2.0 - https://github.com/jpillora/s3hook
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


// XDomain - v0.5.5 - https://github.com/jpillora/xdomain
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2013
(function(window,document,undefined) {
// XHook - v1.0.2 - https://github.com/jpillora/xhook
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2013
(function(window,document,undefined) {
var AFTER, BEFORE, EventEmitter, INVALID_PARAMS_ERROR, READY_STATE, convertHeaders, createXHRFacade, patchClass, pluginEvents, xhook, _base,
  __slice = [].slice;

BEFORE = 'before';

AFTER = 'after';

READY_STATE = 'readyState';

INVALID_PARAMS_ERROR = "Invalid number or parameters. Please see API documentation.";

(_base = Array.prototype).indexOf || (_base.indexOf = function(item) {
  var i, x, _i, _len;
  for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
    x = this[i];
    if (x === item) {
      return i;
    }
  }
  return -1;
});

EventEmitter = function(ctx) {
  var emitter, events, listeners;
  events = {};
  listeners = function(event) {
    return events[event] || [];
  };
  emitter = {
    listeners: function(event) {
      return Array.prototype.slice.call(listeners(event));
    },
    on: function(event, callback, i) {
      events[event] = listeners(event);
      if (events[event].indexOf(callback) >= 0) {
        return;
      }
      i = i === undefined ? events[event].length : i;
      events[event].splice(i, 0, callback);
    },
    off: function(event, callback) {
      var i;
      i = listeners(event).indexOf(callback);
      if (i === -1) {
        return;
      }
      listeners(event).splice(i, 1);
    },
    fire: function() {
      var args, event, listener, _i, _len, _ref;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = listeners(event);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        listener.apply(ctx, args);
      }
    }
  };
  return emitter;
};

pluginEvents = EventEmitter();

xhook = {};

xhook[BEFORE] = function(handler, i) {
  return pluginEvents.on(BEFORE, handler, i);
};

xhook[AFTER] = function(handler, i) {
  return pluginEvents.on(AFTER, handler, i);
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

patchClass = function(name) {
  var Class;
  Class = window[name];
  if (!Class) {
    return;
  }
  window[name] = function(arg) {
    if (typeof arg === "string" && !/\.XMLHTTP/.test(arg)) {
      return;
    }
    return createXHRFacade(new Class(arg));
  };
};

patchClass("ActiveXObject");

patchClass("XMLHttpRequest");

createXHRFacade = function(xhr) {
  var checkEvent, copyBody, copyHead, currentState, event, extractProps, face, readyBody, readyHead, request, response, setReadyState, transiting, xhrEvents, _i, _len, _ref;
  if (pluginEvents.listeners(BEFORE).length === 0 && pluginEvents.listeners(AFTER).length === 0) {
    return xhr;
  }
  transiting = false;
  request = {
    headers: {}
  };
  response = null;
  xhrEvents = EventEmitter();
  readyHead = function() {
    face.status = response.status;
    face.statusText = response.statusText;
    response.headers || (response.headers = {});
  };
  readyBody = function() {
    face.responseType = response.type || '';
    face.response = response.data || null;
    face.responseText = response.text || response.data || '';
    face.responseXML = response.xml || null;
  };
  copyHead = function() {
    var key, val, _ref, _results;
    response.status = xhr.status;
    response.statusText = xhr.statusText;
    _ref = convertHeaders(xhr.getAllResponseHeaders());
    _results = [];
    for (key in _ref) {
      val = _ref[key];
      if (!response.headers[key]) {
        _results.push(response.headers[key] = val);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  copyBody = function() {
    response.type = xhr.responseType;
    response.text = xhr.responseText;
    response.data = xhr.response || response.text;
    return response.xml = xhr.responseXML;
  };
  currentState = 0;
  setReadyState = function(n) {
    var fire, hooks, process;
    extractProps();
    fire = function() {
      while (n > currentState && currentState < 4) {
        face[READY_STATE] = ++currentState;
        if (currentState === 2) {
          readyHead();
        }
        if (currentState === 4) {
          readyBody();
        }
        xhrEvents.fire("readystatechange");
        if (currentState === 4) {
          xhrEvents.fire("load");
        }
      }
    };
    if (n < 4) {
      return fire();
    }
    hooks = pluginEvents.listeners(AFTER);
    process = function() {
      var hook;
      if (!hooks.length) {
        return fire();
      }
      hook = hooks.shift();
      if (hook.length === 2) {
        hook(request, response);
        return process();
      } else if (hook.length === 3) {
        return hook(request, response, process);
      } else {
        throw INVALID_PARAMS_ERROR;
      }
    };
    process();
  };
  checkEvent = function(e) {
    var clone, key, val;
    clone = {};
    for (key in e) {
      val = e[key];
      clone[key] = val === xhr ? face : val;
    }
    return clone;
  };
  extractProps = function() {
    var fn, key, _i, _len, _ref;
    _ref = ['timeout'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (xhr[key] && request[key] === undefined) {
        request[key] = xhr[key];
      }
    }
    for (key in face) {
      fn = face[key];
      if (typeof fn === 'function' && /^on(\w+)/.test(key)) {
        xhrEvents.on(RegExp.$1, fn);
      }
    }
  };
  xhr.onreadystatechange = function(event) {
    if (typeof xhr.status !== 'unknown' && xhr[READY_STATE] === 2) {
      copyHead();
    }
    if (xhr[READY_STATE] === 4) {
      transiting = false;
      copyHead();
      copyBody();
      setReadyState(xhr[READY_STATE]);
    }
  };
  _ref = ['abort', 'progress'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    event = _ref[_i];
    xhr["on" + event] = function(obj) {
      return xhrEvents.fire(event, checkEvent(obj));
    };
  }
  face = {
    withCredentials: false,
    response: null,
    status: 0
  };
  face.addEventListener = function(event, fn) {
    return xhrEvents.on(event, fn);
  };
  face.removeEventListener = xhrEvents.off;
  face.dispatchEvent = function() {};
  face.open = function(method, url, async) {
    request.method = method;
    request.url = url;
    request.async = async;
    setReadyState(1);
  };
  face.send = function(body) {
    var hooks, process, send;
    request.body = body;
    send = function() {
      var header, value, _ref1;
      response = {
        headers: {}
      };
      transiting = true;
      xhr.open(request.method, request.url, request.async);
      if (request.timeout) {
        xhr.timeout = request.timeout;
      }
      _ref1 = request.headers;
      for (header in _ref1) {
        value = _ref1[header];
        xhr.setRequestHeader(header, value);
      }
      xhr.send(request.body);
    };
    hooks = pluginEvents.listeners(BEFORE);
    process = function() {
      var done, hook;
      if (!hooks.length) {
        return send();
      }
      done = function(resp) {
        if (typeof resp === 'object' && typeof resp.status === 'number') {
          response = resp;
          setReadyState(4);
        } else {
          return process();
        }
      };
      hook = hooks.shift();
      if (hook.length === 1) {
        return done(hook(request));
      } else if (hook.length === 2) {
        return hook(request, done);
      } else {
        throw INVALID_PARAMS_ERROR;
      }
    };
    process();
  };
  face.abort = function() {
    if (transiting) {
      xhr.abort();
    }
    xhrEvents.fire('abort', arguments);
  };
  face.setRequestHeader = function(header, value) {
    request.headers[header] = value;
  };
  face.getResponseHeader = function(header) {
    return response.headers[header];
  };
  face.getAllResponseHeaders = function() {
    return convertHeaders(response.headers);
  };
  face.upload = EventEmitter();
  return face;
};

window.xhook = xhook;
}(window,document));
'use strict';
var CHECK_INTERVAL, COMPAT_VERSION, Frame, addMasters, addSlaves, attr, currentOrigin, feature, getMessage, guid, m, masters, onMessage, p, parseUrl, prefix, s, script, setMessage, setupReceiver, setupSender, slaves, toRegExp, warn, xdomain, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

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

COMPAT_VERSION = "V0";

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

masters = null;

addMasters = function(m) {
  var origin, path;
  if (masters === null) {
    masters = {};
    setupReceiver();
  }
  for (origin in m) {
    path = m[origin];
    masters[origin] = path;
  }
};

setupReceiver = function() {
  onMessage(function(event) {
    var frame, k, master, masterRegex, message, origin, p, pathRegex, proxyXhr, regex, req, v, _ref1;
    origin = event.origin === "null" ? "*" : event.origin;
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
    req = message.msg;
    p = parseUrl(req.url);
    if (!(p && pathRegex.test(p.path))) {
      warn("blocked request to path: '" + p.path + "' by regex: " + regex);
      return;
    }
    proxyXhr = new XMLHttpRequest();
    proxyXhr.open(req.method, req.url);
    proxyXhr.onreadystatechange = function() {
      var resp;
      if (proxyXhr.readyState !== 4) {
        return;
      }
      resp = {
        status: proxyXhr.status,
        statusText: proxyXhr.statusText,
        type: "",
        text: proxyXhr.responseText,
        headers: xhook.headers(proxyXhr.getAllResponseHeaders())
      };
      return frame.postMessage(setMessage({
        id: message.id,
        msg: resp
      }), origin);
    };
    if (req.timeout) {
      proxyXhr.timeout = req.timeout;
    }
    _ref1 = req.headers;
    for (k in _ref1) {
      v = _ref1[k];
      proxyXhr.setRequestHeader(k, v);
    }
    return proxyXhr.send(req.body || null);
  });
  if (window === window.parent) {
    return warn("slaves must be in an iframe");
  } else {
    return window.parent.postMessage("XPING_" + COMPAT_VERSION, '*');
  }
};

slaves = null;

addSlaves = function(s) {
  var origin, path;
  if (slaves === null) {
    slaves = {};
    setupSender();
  }
  for (origin in s) {
    path = s[origin];
    slaves[origin] = path;
  }
};

setupSender = function() {
  onMessage(function(e) {
    var _ref1;
    return (_ref1 = Frame.prototype.frames[e.origin]) != null ? _ref1.recieve(e) : void 0;
  });
  return xhook.before(function(request, callback) {
    var frame, p;
    p = parseUrl(request.url);
    if (!(p && slaves[p.origin])) {
      return callback();
    }
    if (request.async === false) {
      warn("sync not supported");
    }
    frame = new Frame(p.origin, slaves[p.origin]);
    frame.send(request, callback);
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
    this.waiters = [];
    this.ready = false;
  }

  Frame.prototype.post = function(msg) {
    this.frame.contentWindow.postMessage(msg, this.origin);
  };

  Frame.prototype.listen = function(id, callback) {
    if (this.listeners[id]) {
      throw "already listening for: " + id;
    }
    this.listeners[id] = callback;
  };

  Frame.prototype.unlisten = function(id) {
    delete this.listeners[id];
  };

  Frame.prototype.recieve = function(event) {
    var cb, message;
    if (/^XPING(_(V\d+))?$/.test(event.data)) {
      if (RegExp.$2 !== COMPAT_VERSION) {
        warn("your master is not compatible with your slave, check your xdomain.js verison");
        return;
      }
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
    cb(message.msg);
  };

  Frame.prototype.send = function(msg, callback) {
    var _this = this;
    this.readyCheck(function() {
      var id;
      id = guid();
      _this.listen(id, function(data) {
        return callback(data);
      });
      return _this.post(setMessage({
        id: id,
        msg: msg
      }));
    });
  };

  Frame.prototype.readyCheck = function(callback) {
    var check,
      _this = this;
    if (this.ready) {
      return callback();
    }
    this.waiters.push(callback);
    if (this.waiters.length !== 1) {
      return;
    }
    check = function() {
      if (_this.ready) {
        while (_this.waiters.length) {
          _this.waiters.shift()();
        }
        return;
      }
      if (_this.waits++ >= xdomain.timeout / CHECK_INTERVAL) {
        throw "Timeout connecting to iframe: " + _this.origin;
      } else {
        return setTimeout(check, CHECK_INTERVAL);
      }
    };
    check();
  };

  return Frame;

})();

xdomain = function(o) {
  if (!o) {
    return;
  }
  if (o.masters) {
    addMasters(o.masters);
  }
  if (o.slaves) {
    addSlaves(o.slaves);
  }
};

xdomain.parseUrl = parseUrl;

xdomain.origin = currentOrigin;

xdomain.timeout = 15e3;

CHECK_INTERVAL = 100;

window.xdomain = xdomain;

_ref1 = document.getElementsByTagName("script");
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  script = _ref1[_j];
  if (/xdomain/.test(script.src)) {
    _ref2 = ['', 'data-'];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      prefix = _ref2[_k];
      attr = script.getAttribute(prefix + 'slave');
      if (attr) {
        p = parseUrl(attr);
        if (!p) {
          return;
        }
        s = {};
        s[p.origin] = p.path;
        addSlaves(s);
        break;
      }
      attr = script.getAttribute(prefix + 'master');
      if (attr) {
        m = {};
        m[attr] = /./;
        addMasters(m);
      }
    }
  }
}
}(window,document));
var ACCESS_KEY, SECRET_KEY, add, clear, configs, e, endpoints, init, remove, set, sign, slaves;

ACCESS_KEY = 'accessKeyId';

SECRET_KEY = 'secretAccessKey';

slaves = {
  "https://s3.amazonaws.com": "/jpillora-usa/xdomain/proxy.html",
  "https://s3-ap-southeast-2.amazonaws.com": "/jpillora-aus/xdomain/proxy.html"
};

xdomain({
  slaves: slaves
});

endpoints = [];

for (e in slaves) {
  endpoints.push(e);
}

configs = [];

hashing.hmac_hash = hashing.sha1;

sign = function(key, str) {
  return encoding.base64_encode(encoding.hstr2astr(hashing.HMAC(key, str)));
};

init = function() {
  console.log('init!');
  init = function() {};
  return xhook.before(function(request) {
    var amz, c, config, header, message, name, type, url, value, _ref;
    url = xdomain.parseUrl(request.url);
    if (!(url && url.path && slaves[url.origin])) {
      console.log('s3hook skipping: ' + request.url);
      return;
    }
    config = null;
    for (name in configs) {
      c = configs[name];
      if (c.path.test(url.path)) {
        config = c;
        break;
      }
    }
    if (!config) {
      console.log('s3hook blocking path: ' + request.path);
      return;
    }
    if (request.method !== 'GET') {
      request.headers['Content-Type'] = 'text/plain; charset=UTF-8';
    }
    type = request.headers['Content-Type'];
    request.headers['x-amz-date'] = new Date().toUTCString();
    amz = [];
    _ref = request.headers;
    for (header in _ref) {
      value = _ref[header];
      if (/^x-amz/i.test(header)) {
        amz.push(header.toLowerCase() + ":" + value);
      }
    }
    message = [request.method, "", type, "", amz.join("\n"), url.path].join("\n");
    request.headers["Authorization"] = "AWS " + config.access + ":" + sign(config.secret, message);
    console.log('signed!');
  }, 0);
};

set = function(access, secret) {
  return add('DEFAULT', access, secret);
};

clear = function() {
  return add('DEFAULT', access, secret);
};

add = function(name, access, secret, path) {
  if (path == null) {
    path = /.*/;
  }
  configs[name] = {
    access: access,
    secret: secret,
    path: path
  };
  init();
};

remove = function(name) {
  return delete configs[name];
};

set.encoding = encoding;

set.hashing = hashing;

set.endpoints = endpoints;

window.s3hook = set;
}(window,document));