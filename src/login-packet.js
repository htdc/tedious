var Packet = require('./packet').Packet,
    TYPE = require('./packet').TYPE,
    jspack = require('./jspack').jspack,
    
    FLAGS_1 = {
      ENDIAN_LITTLE: 0x00,
      ENDIAN_BIG: 0x01,
      
      CHARSET_ASCII: 0x00,
      CHARSET_EBCDIC: 0x02,
      
      FLOAT_IEEE_754: 0x00,
      FLOAT_VAX: 0x04,
      FLOAT_ND5000: 0x08,
      
      BCP_DUMPLOAD_ON: 0x00,
      BCP_DUMPLOAD_OFF: 0x10,
      
      USE_DB_ON: 0x00,
      USE_DB_OFF: 0x20,
      
      INIT_DB_WARN: 0x00,
      INIT_DB_FATAL: 0x40,
      
      SET_LANG_WARN_OFF: 0x00,
      SET_LANG_WARN_ON: 0x80,
    },
    flags1 =
      FLAGS_1.ENDIAN_LITTLE |
      FLAGS_1.CHARSET_ASCII |
      FLAGS_1.FLOAT_IEEE_754 |
      FLAGS_1.BCD_DUMPLOAD_ON |
      FLAGS_1.USE_DB_OFF |
      FLAGS_1.INIT_DB_FATAL |
      FLAGS_1.SET_LANG_WARN_ON,

    FLAGS_2 = {
      INIT_LANG_WARN: 0x00,
      INIT_LANG_FATAL: 0x01,

      ODBC_OFF: 0x00,
      ODBC_ON: 0x02,
      
      F_TRAN_BOUNDARY: 0x04,
      
      F_CACHE_CONNECT: 0x08,
      
      USER_NORMAL: 0x00,
      USER_SERVER: 0x10, 
      USER_REMUSER: 0x20, 
      USER_SQLREPL: 0x40, 
      
      INTEGRATED_SECURITY_OFF: 0x00,
      INTEGRATED_SECURITY_ON: 0x80
    },
    flags2 =
      FLAGS_2.INIT_LANG_WARN |
      FLAGS_2.ODBC_OFF |
      FLAGS_2.USER_NORMAL |
      FLAGS_2.INTEGRATED_SECURITY_OFF,
      
    TYPE_FLAGS = {
      SQL_DFLT: 0x00,
      SQL_TSQL: 0x01,
      
      OLEDB_OFF: 0x00,
      OLEDB_ON: 0x02
    },
    typeFlags =
      TYPE_FLAGS.SQL_DFLT |
      TYPE_FLAGS.OLEDB_OFF,
      
    FLAGS_3 = {
      CHANGE_PASSWORD_NO: 0x00,
      CHANGE_PASSWORD_YES: 0x01,
      
      BINARY_XML: 0x02,
      
      SPAWN_USER_INSTANCE: 0x04
    },
    flags3 =
      FLAGS_3.CHANGE_PASSWORD_NO
      
    ;

var LoginPacket = function(headerFields) {
  var length,
      fixedData = buildFixedData(),
      variableData = buildVariableData(),
      data;

  length = jspack.Pack('L', [4 + fixedData.length + variableData.length]);

  data = length;
  data = data.concat(fixedData)
  data = data.concat(variableData);
  
  return new Packet(TYPE.LOGIN7, data, headerFields);
};

function buildFixedData() {
  var data = [],
      tdsVersion = 0x00000071,    // 7.1
      packetSize = 4 * 1024,
      clientProgVer = 0,
      clientPid = 0,
      connectionId = 0,
      clientTimeZone = 0 ;        // Can't figure what form this should take.
      clientLcid = 0 ;            // Can't figure what form this should take.
  
  data = data.concat(jspack.Pack('LLLLL', [tdsVersion, packetSize, clientProgVer, clientPid, connectionId]));
  data = data.concat(jspack.Pack('BBBB', [flags1, flags2, typeFlags, flags3]));
  data = data.concat(jspack.Pack('L', [clientTimeZone]));
  data = data.concat(jspack.Pack('L', [clientLcid]));
  
  return data;
}

function buildVariableData() {
  var data = [];
  
  return data;
}

exports.LoginPacket = LoginPacket;