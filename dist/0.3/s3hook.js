// S3 Hook - v0.3.0 - https://github.com/jpillora/s3hook
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2014
(function(window,undefined) {/**
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


// XDomain - v0.6.0 - https://github.com/jpillora/xdomain
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2014
(function(window,undefined) {// XHook - v1.1.4 - https://github.com/jpillora/xhook
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2014
(function(window,undefined) {var AFTER, BEFORE, COMMON_EVENTS, EventEmitter, FIRE, FormData, OFF, ON, READY_STATE, UPLOAD_EVENTS, XMLHTTP, convertHeaders, document, fakeEvent, mergeObjects, proxyEvents, slice, xhook, _base,
  __slice = [].slice;

document = window.document;

BEFORE = 'before';

AFTER = 'after';

READY_STATE = 'readyState';

ON = 'addEventListener';

OFF = 'removeEventListener';

FIRE = 'dispatchEvent';

XMLHTTP = 'XMLHttpRequest';

FormData = 'FormData';

UPLOAD_EVENTS = ['load', 'loadend', 'loadstart'];

COMMON_EVENTS = ['progress', 'abort', 'error', 'timeout'];

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

slice = function(o, n) {
  return Array.prototype.slice.call(o, n);
};

mergeObjects = function(src, dst) {
  var k, v;
  for (k in src) {
    v = src[k];
    if (k === "returnValue") {
      continue;
    }
    try {
      dst[k] = src[k];
    } catch (_error) {}
  }
  return dst;
};

proxyEvents = function(events, from, to) {
  var event, p, _i, _len;
  p = function(event) {
    return function(e) {
      var clone, k, val;
      clone = {};
      for (k in e) {
        if (k === "returnValue") {
          continue;
        }
        val = e[k];
        clone[k] = val === from ? to : val;
      }
      clone;
      return to[FIRE](event, clone);
    };
  };
  for (_i = 0, _len = events.length; _i < _len; _i++) {
    event = events[_i];
    from["on" + event] = p(event);
  }
};

fakeEvent = function(type) {
  var msieEventObject;
  if (document.createEventObject != null) {
    msieEventObject = document.createEventObject();
    msieEventObject.type = type;
    return msieEventObject;
  } else {
    try {
      return new Event(type);
    } catch (_error) {
      return {
        type: type
      };
    }
  }
};

EventEmitter = function(nodeStyle) {
  var emitter, events, listeners;
  events = {};
  listeners = function(event) {
    return events[event] || [];
  };
  emitter = {};
  emitter[ON] = function(event, callback, i) {
    events[event] = listeners(event);
    if (events[event].indexOf(callback) >= 0) {
      return;
    }
    i = i === undefined ? events[event].length : i;
    events[event].splice(i, 0, callback);
  };
  emitter[OFF] = function(event, callback) {
    var i;
    i = listeners(event).indexOf(callback);
    if (i === -1) {
      return;
    }
    listeners(event).splice(i, 1);
  };
  emitter[FIRE] = function() {
    var args, event, i, legacylistener, listener, _i, _len, _ref;
    args = slice(arguments);
    event = args.shift();
    if (!nodeStyle) {
      args[0] = mergeObjects(args[0], fakeEvent(event));
    }
    legacylistener = emitter["on" + event];
    if (legacylistener) {
      legacylistener.apply(undefined, args);
    }
    _ref = listeners(event).concat(listeners("*"));
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      listener = _ref[i];
      listener.apply(undefined, args);
    }
  };
  if (nodeStyle) {
    emitter.listeners = function(event) {
      return slice(listeners(event));
    };
    emitter.on = emitter[ON];
    emitter.off = emitter[OFF];
    emitter.fire = emitter[FIRE];
    emitter.once = function(e, fn) {
      var fire;
      fire = function() {
        emitter.off(e, fire);
        return fn.apply(null, arguments);
      };
      return emitter.on(e, fire);
    };
    emitter.destroy = function() {
      return events = {};
    };
  }
  return emitter;
};

xhook = EventEmitter(true);

xhook.EventEmitter = EventEmitter;

xhook[BEFORE] = function(handler, i) {
  if (handler.length < 1 || handler.length > 2) {
    throw "invalid hook";
  }
  return xhook[ON](BEFORE, handler, i);
};

xhook[AFTER] = function(handler, i) {
  if (handler.length < 2 || handler.length > 3) {
    throw "invalid hook";
  }
  return xhook[ON](AFTER, handler, i);
};

convertHeaders = xhook.headers = function(h, dest) {
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

xhook[FormData] = window[FormData];

window[FormData] = function() {
  var _this = this;
  this.fd = new xhook[FormData];
  this.entries = [];
  this.append = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _this.entries.push(args);
    return _this.fd.append.apply(_this.fd, args);
  };
};

xhook[XMLHTTP] = window[XMLHTTP];

window[XMLHTTP] = function() {
  var currentState, facade, readBody, readHead, request, response, setReadyState, transiting, writeBody, writeHead, xhr;
  xhr = new xhook[XMLHTTP]();
  transiting = false;
  request = {};
  request.headers = {};
  response = {};
  response.headers = {};
  readHead = function() {
    var key, val, _ref;
    response.status = xhr.status;
    response.statusText = xhr.statusText;
    _ref = convertHeaders(xhr.getAllResponseHeaders());
    for (key in _ref) {
      val = _ref[key];
      if (!response.headers[key]) {
        response.headers[key] = val;
      }
    }
  };
  readBody = function() {
    try {
      response.text = xhr.responseText;
    } catch (_error) {}
    try {
      response.xml = xhr.responseXML;
    } catch (_error) {}
    response.data = xhr.response || response.text;
  };
  writeHead = function() {
    facade.status = response.status;
    facade.statusText = response.statusText;
  };
  writeBody = function() {
    facade.response = response.data || response.text || null;
    facade.responseText = response.text || '';
    facade.responseXML = response.xml || null;
  };
  currentState = 0;
  setReadyState = function(n) {
    var checkReadyState, hooks, process;
    checkReadyState = function() {
      while (n > currentState && currentState < 4) {
        facade[READY_STATE] = ++currentState;
        if (currentState === 1) {
          facade[FIRE]("loadstart", {});
        }
        if (currentState === 2) {
          writeHead();
        }
        if (currentState === 4) {
          writeHead();
          writeBody();
        }
        facade[FIRE]("readystatechange", {});
        if (currentState === 4) {
          facade[FIRE]("load", {});
          facade[FIRE]("loadend", {});
        }
      }
    };
    if (n < 4) {
      checkReadyState();
      return;
    }
    hooks = xhook.listeners(AFTER);
    process = function() {
      var hook;
      if (!hooks.length) {
        return checkReadyState();
      }
      hook = hooks.shift();
      if (hook.length === 2) {
        hook(request, response);
        return process();
      } else if (hook.length === 3) {
        return hook(request, response, process);
      }
    };
    process();
  };
  xhr.onreadystatechange = function(event) {
    try {
      if (xhr[READY_STATE] === 2) {
        readHead();
      }
    } catch (_error) {}
    if (xhr[READY_STATE] === 4) {
      transiting = false;
      readHead();
      readBody();
    }
    setReadyState(xhr[READY_STATE]);
  };
  facade = request.xhr = EventEmitter();
  facade[ON]('progress', function() {
    return setReadyState(3);
  });
  proxyEvents(COMMON_EVENTS, xhr, facade);
  facade.withCredentials = false;
  facade.response = null;
  facade.status = 0;
  facade.open = function(method, url, async, user, pass) {
    request.method = method;
    request.url = url;
    if (async === false) {
      throw "sync xhr not supported by XHook";
    }
    request.user = user;
    request.pass = pass;
    setReadyState(1);
  };
  facade.send = function(body) {
    var hooks, k, modk, process, send, _i, _len, _ref;
    _ref = ['type', 'timeout'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      modk = k === "type" ? "responseType" : k;
      request[k] = facade[modk];
    }
    request.body = body;
    send = function() {
      var header, value, _j, _len1, _ref1, _ref2;
      transiting = true;
      xhr.open(request.method, request.url, true, request.user, request.pass);
      _ref1 = ['type', 'timeout'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        k = _ref1[_j];
        modk = k === "type" ? "responseType" : k;
        xhr[modk] = request[k];
      }
      _ref2 = request.headers;
      for (header in _ref2) {
        value = _ref2[header];
        xhr.setRequestHeader(header, value);
      }
      if (request.body instanceof window[FormData]) {
        request.body = request.body.fd;
      }
      xhr.send(request.body);
    };
    hooks = xhook.listeners(BEFORE);
    process = function() {
      var done, hook;
      if (!hooks.length) {
        return send();
      }
      done = function(resp) {
        if (typeof resp === 'object' && (typeof resp.status === 'number' || typeof response.status === 'number')) {
          mergeObjects(resp, response);
          setReadyState(4);
          return;
        }
        process();
      };
      done.head = function(resp) {
        mergeObjects(resp, response);
        return setReadyState(2);
      };
      done.progress = function(resp) {
        mergeObjects(resp, response);
        return setReadyState(3);
      };
      hook = hooks.shift();
      if (hook.length === 1) {
        return done(hook(request));
      } else if (hook.length === 2) {
        return hook(request, done);
      }
    };
    process();
  };
  facade.abort = function() {
    if (transiting) {
      xhr.abort();
    }
    facade[FIRE]('abort', {});
  };
  facade.setRequestHeader = function(header, value) {
    request.headers[header] = value;
  };
  facade.getResponseHeader = function(header) {
    return response.headers[header];
  };
  facade.getAllResponseHeaders = function() {
    return convertHeaders(response.headers);
  };
  if (xhr.overrideMimeType) {
    facade.overrideMimeType = function() {
      return xhr.overrideMimeType.apply(xhr, arguments);
    };
  }
  if (xhr.upload) {
    facade.upload = request.upload = EventEmitter();
    proxyEvents(COMMON_EVENTS.concat(UPLOAD_EVENTS), xhr.upload, facade.upload);
  }
  return facade;
};

(this.define || Object)((this.exports || this).xhook = xhook);
}(this));
var CHECK_INTERVAL, COMPAT_VERSION, XD_CHECK, addMasters, addSlaves, attrs, connect, console, createSocket, currentOrigin, feature, fn, frames, getFrame, guid, handler, initMaster, initSlave, instOf, jsonEncode, k, listen, log, masters, onMessage, parseUrl, prefix, prep, script, slaves, slice, sockets, startPostMessage, strip, toRegExp, warn, xdomain, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

slaves = null;

addSlaves = function(s) {
  var origin, path;
  if (slaves === null) {
    slaves = {};
    initMaster();
  }
  for (origin in s) {
    path = s[origin];
    slaves[origin] = path;
  }
};

frames = {};

getFrame = function(origin, proxyPath) {
  var frame;
  if (frames[origin]) {
    return frames[origin];
  }
  frame = document.createElement("iframe");
  frame.id = frame.name = guid();
  frame.src = origin + proxyPath;
  frame.setAttribute('style', 'display:none;');
  document.body.appendChild(frame);
  return frames[origin] = frame.contentWindow;
};

initMaster = function() {
  return xhook.before(function(request, callback) {
    var frame, obj, p, socket;
    p = parseUrl(request.url);
    if (!(p && slaves[p.origin])) {
      log("no slave matching: '" + p.origin + "'");
      return callback();
    }
    log("proxying request slave: '" + p.origin + "'");
    if (request.async === false) {
      warn("sync not supported");
      return callback();
    }
    frame = getFrame(p.origin, slaves[p.origin]);
    socket = connect(frame);
    socket.on("response", function(resp) {
      callback(resp);
      return socket.close();
    });
    request.xhr.addEventListener('abort', function() {
      return socket.emit("abort");
    });
    socket.on("xhr-event", function() {
      return request.xhr.dispatchEvent.apply(null, arguments);
    });
    socket.on("xhr-upload-event", function() {
      return request.xhr.upload.dispatchEvent.apply(null, arguments);
    });
    obj = strip(request);
    obj.headers = request.headers;
    if (instOf(request.body, 'FormData')) {
      obj.body = ["XD_FD", request.body.entries];
    }
    if (instOf(request.body, 'Uint8Array')) {
      obj.body = request.body;
    }
    socket.emit("request", obj);
  });
};

masters = null;

addMasters = function(m) {
  var origin, path;
  if (masters === null) {
    masters = {};
    initSlave();
  }
  for (origin in m) {
    path = m[origin];
    masters[origin] = path;
  }
};

initSlave = function() {
  listen(function(origin, socket) {
    var master, masterRegex, pathRegex, regex;
    if (origin === "null") {
      origin = "*";
    }
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
    socket.once("request", function(req) {
      var args, fd, k, p, v, xhr, _i, _len, _ref, _ref1;
      log("request: " + req.method + " " + req.url);
      p = parseUrl(req.url);
      if (!(p && pathRegex.test(p.path))) {
        warn("blocked request to path: '" + p.path + "' by regex: " + regex);
        socket.close();
        return;
      }
      xhr = new XMLHttpRequest();
      xhr.open(req.method, req.url);
      xhr.addEventListener("*", function(e) {
        return socket.emit('xhr-event', e.type, strip(e));
      });
      if (xhr.upload) {
        xhr.upload.addEventListener("*", function(e) {
          return socket.emit('xhr-upload-event', e.type, strip(e));
        });
      }
      socket.once("abort", function() {
        return xhr.abort();
      });
      xhr.onreadystatechange = function() {
        var resp;
        if (xhr.readyState !== 4) {
          return;
        }
        resp = {
          status: xhr.status,
          statusText: xhr.statusText,
          data: xhr.response,
          headers: xhook.headers(xhr.getAllResponseHeaders())
        };
        try {
          resp.text = xhr.responseText;
        } catch (_error) {}
        return socket.emit('response', resp);
      };
      if (req.timeout) {
        xhr.timeout = req.timeout;
      }
      if (req.type) {
        xhr.responseType = req.type;
      }
      _ref = req.headers;
      for (k in _ref) {
        v = _ref[k];
        xhr.setRequestHeader(k, v);
      }
      if (req.body instanceof Array && req.body[0] === "XD_FD") {
        fd = new xhook.FormData();
        _ref1 = req.body[1];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          args = _ref1[_i];
          fd.append.apply(fd, args);
        }
        req.body = fd;
      }
      xhr.send(req.body || null);
    });
    log("slave listening for requests on socket: " + socket.id);
  });
  if (window === window.parent) {
    return warn("slaves must be in an iframe");
  } else {
    return window.parent.postMessage("XDPING_" + COMPAT_VERSION, '*');
  }
};

onMessage = function(fn) {
  if (document.addEventListener) {
    return window.addEventListener("message", fn);
  } else {
    return window.attachEvent("onmessage", fn);
  }
};

handler = null;

sockets = {};

jsonEncode = true;

XD_CHECK = "XD_CHECK";

startPostMessage = function() {
  return onMessage(function(e) {
    var d, extra, id, sock;
    d = e.data;
    if (typeof d === "string") {
      if (/^XPING_/.test(d)) {
        return warn("your master is not compatible with your slave, check your xdomain.js verison");
      } else if (/^xdomain-/.test(d)) {
        d = d.split(",");
      } else {
        try {
          d = JSON.parse(d);
        } catch (_error) {
          return;
        }
      }
    }
    if (!(d instanceof Array)) {
      return;
    }
    id = d.shift();
    if (!/^xdomain-/.test(id)) {
      return;
    }
    sock = sockets[id];
    if (sock === null) {
      return;
    }
    if (sock === undefined) {
      if (!handler) {
        return;
      }
      sock = createSocket(id, e.source);
      handler(e.origin, sock);
    }
    extra = typeof d[1] === "string" ? ": '" + d[1] + "'" : "";
    log("receive socket: " + id + ": '" + d[0] + "'" + extra);
    sock.fire.apply(sock, d);
  });
};

createSocket = function(id, frame) {
  var check, checks, emit, pendingEmits, ready, sock,
    _this = this;
  ready = false;
  sock = sockets[id] = xhook.EventEmitter(true);
  sock.id = id;
  sock.once('close', function() {
    sock.destroy();
    return sock.close();
  });
  pendingEmits = [];
  sock.emit = function() {
    var args, extra;
    args = slice(arguments);
    extra = typeof args[1] === "string" ? ": '" + args[1] + "'" : "";
    log("send socket: " + id + ": " + args[0] + extra);
    args.unshift(id);
    if (ready) {
      emit(args);
    } else {
      pendingEmits.push(args);
    }
  };
  emit = function(args) {
    if (jsonEncode) {
      args = JSON.stringify(args);
    }
    frame.postMessage(args, "*");
  };
  sock.close = function() {
    sock.emit('close');
    log("close socket: " + id);
    sockets[id] = null;
  };
  sock.once(XD_CHECK, function(obj) {
    jsonEncode = typeof obj === "string";
    ready = true;
    log("ready socket: " + id);
    while (pendingEmits.length) {
      emit(pendingEmits.shift());
    }
  });
  checks = 0;
  check = function() {
    frame.postMessage([id, XD_CHECK, ready, {}], "*");
    if (ready) {
      return;
    }
    if (checks++ === xdomain.timeout / CHECK_INTERVAL) {
      warn("Timeout waiting on iframe socket");
    } else {
      setTimeout(check, CHECK_INTERVAL);
    }
  };
  setTimeout(check);
  log("new socket: " + id);
  return sock;
};

connect = function(target) {
  var s;
  s = createSocket(guid(), target);
  return s;
};

listen = function(h) {
  handler = h;
};

'use strict';

currentOrigin = location.protocol + '//' + location.host;

guid = function() {
  return 'xdomain-' + Math.round(Math.random() * Math.pow(2, 32)).toString(16);
};

slice = function(o, n) {
  return Array.prototype.slice.call(o, n);
};

prep = function(s) {
  return "xdomain (" + currentOrigin + "): " + s;
};

console = window.console || {};

log = function(str) {
  if (!xdomain.debug) {
    return;
  }
  str = prep(str);
  if ('log' in console) {
    console.log(str);
  }
};

warn = function(str) {
  str = prep(str);
  if ('warn' in console) {
    console.warn(str);
  } else {
    alert(str);
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

instOf = function(obj, global) {
  if (typeof window[global] !== "function") {
    return false;
  }
  return obj instanceof window[global];
};

COMPAT_VERSION = "V1";

parseUrl = function(url) {
  if (/(https?:\/\/[^\/\?]+)(\/.*)?/.test(url)) {
    return {
      origin: RegExp.$1,
      path: RegExp.$2
    };
  } else {
    log("failed to parse url: " + url);
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

strip = function(src) {
  var dst, k, v, _ref1;
  dst = {};
  for (k in src) {
    if (k === "returnValue") {
      continue;
    }
    v = src[k];
    if ((_ref1 = typeof v) !== "function" && _ref1 !== "object") {
      dst[k] = v;
    }
  }
  return dst;
};

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

xdomain.debug = false;

xdomain.masters = addMasters;

xdomain.slaves = addSlaves;

xdomain.parseUrl = parseUrl;

xdomain.origin = currentOrigin;

xdomain.timeout = 15e3;

CHECK_INTERVAL = 100;

window.xdomain = xdomain;

attrs = {
  slave: function(value) {
    var p, s;
    p = parseUrl(value);
    if (!p) {
      return;
    }
    s = {};
    s[p.origin] = p.path;
    return addSlaves(s);
  },
  master: function(value) {
    var m;
    if (!value) {
      return;
    }
    m = {};
    m[value] = /./;
    return addMasters(m);
  },
  debug: function(value) {
    if (typeof value !== "string") {
      return;
    }
    return xdomain.debug = value !== "false";
  }
};

_ref1 = document.getElementsByTagName("script");
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  script = _ref1[_j];
  if (/xdomain/.test(script.src)) {
    _ref2 = ['', 'data-'];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      prefix = _ref2[_k];
      for (k in attrs) {
        fn = attrs[k];
        fn(script.getAttribute(prefix + k));
      }
    }
  }
}

startPostMessage();
}(this));
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
var ACCESS_KEY, SECRET_KEY, add, clear, configs, hasContentType, init, proxy, remove, s3hook, set, sign, slaves;

ACCESS_KEY = 'accessKeyId';

SECRET_KEY = 'secretAccessKey';

slaves = {
  "https://s3.amazonaws.com": "/jpillora-usa/xdomain/0.6/proxy.html",
  "https://s3-ap-southeast-2.amazonaws.com": "/jpillora-aus/xdomain/0.6/proxy.html"
};

xdomain({
  slaves: slaves
});

configs = [];

hashing.hmac_hash = hashing.sha1;

sign = function(key, str) {
  return encoding.base64_encode(encoding.hstr2astr(hashing.HMAC(key, str)));
};

init = function() {
  init.d = true;
  xhook.before(function(request) {
    var amz, c, config, header, message, name, path, type, typeName, url, value, _ref;
    url = xdomain.parseUrl(request.url);
    if (!(url && url.path && slaves[url.origin])) {
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
      return;
    }
    path = '';
    if (/https?:\/\/(([^\.]+)\.)s3[\w-]*\.amazonaws.com/.test(url.origin)) {
      path += '/' + RegExp.$2;
    }
    path += url.path;
    typeName = hasContentType(request.headers);
    if (typeName) {
      type = request.headers[typeName];
    } else if (request.body) {
      type = request.headers['Content-Type'] = 'text/plain; charset=UTF-8';
    } else {
      type = '';
    }
    type = type.replace(/utf-/, 'UTF-');
    request.headers['x-amz-date'] = new Date().toUTCString();
    amz = [];
    _ref = request.headers;
    for (header in _ref) {
      value = _ref[header];
      if (/^x-amz/i.test(header)) {
        amz.push(header.toLowerCase() + ":" + value);
      }
    }
    message = [request.method, "", type, "", amz.join("\n"), path].join("\n");
    request.headers["Authorization"] = "AWS " + config.access + ":" + (sign(config.secret, message));
  }, 0);
  return xhook.after(function(request, response) {
    var json, obj, type, typeName, xml;
    if (!s3hook.xml2json) {
      return;
    }
    typeName = hasContentType(response.headers);
    if (!typeName) {
      return;
    }
    type = response.headers[typeName];
    if (/\/xml$/.test(type)) {
      try {
        xml = str2xml(response.text);
        obj = xml2json(xml);
        json = JSON.stringify(obj, null, 2);
        response.headers[typeName] = 'application/json';
        response.text = json;
      } catch (_error) {}
    }
  });
};

init.d = false;

hasContentType = function(headers) {
  var h;
  for (h in headers) {
    if (/^content-type$/i.test(h)) {
      return h;
    }
  }
};

s3hook = set = function(access, secret) {
  return add('DEFAULT', access, secret);
};

clear = function() {
  return add('DEFAULT', null, null);
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
  if (!init.d) {
    init();
  }
};

remove = function(name) {
  return delete configs[name];
};

proxy = function(url) {
  var p;
  p = xdomain.parseUrl(url);
  if (!(p && p.path)) {
    return;
  }
  slaves[p.origin] = p.path;
  return xdomain({
    slaves: slaves
  });
};

s3hook.xml2json = true;

s3hook.set = set;

s3hook.clear = clear;

s3hook.add = add;

s3hook.remove = remove;

s3hook.encoding = encoding;

s3hook.hashing = hashing;

s3hook.proxy = proxy;

s3hook.endpoints = function() {
  var e, s;
  e = [];
  for (s in slaves) {
    e.push(s);
  }
  return e;
};

window.s3hook = s3hook;
}(this));