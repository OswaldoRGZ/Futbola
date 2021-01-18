//'INSERT INTO TABLE (COL1, COL2, COl3) values ($1, '
/*
let keys = [ 'Nombre', 'Apellidos', 'Telefono', 'Correo' ]
let values = [ '      Oswaldo ', 'Rofdriguez', '23323123', 'oswaldo@utp.edu.co' ]
let typeData = [ 0, 0, 1, 2 ]

function toStringSQLInsert( keys, values, typeData, callback ) {
  if( keys.length !== values.length || values.length !== typeData.length ) {
    if( callback ) {
      callback('Length is different')
      return
    }
  }
  let ans = 'INSERT INTO TABLE ('
  for( let i = 0; i < keys.length; i++ ) {
    ans += i!==0? `, ${keys[i]}` : keys[i]
  }
  ans += ') values ('
  for( let i = 0; i < values.length; i++ ) {
    values[i] = values[i].toLowerCase();
    values[i] = values[i].trim()
    values[i] = values[i].replace(/ /g, '_');
    if( typeData[i] === 0 ) {
      if( !validateName(values[i]) ) {
        if( callback ) {
          callback('Name bad writed')
          return
        }
      } else {
        ans += i!==0? `, ${values[i]}` : values[i]
      }
      //poner en vez de posición el campoco exacto ingresado---
    } else if( typeData[i] === 1 ) {
      if( !validateNumber(values[i]) ) {
        if( callback ) {
          callback({ idx: i, err: 'Number bad writed'})
          return
        }
      } else {
        ans += i!==0? `, ${values[i]}` : values[i]
      }
    } else if( typeData[i] === 2 ) {
      if( !validateEmail(values[i]) ) {
        if( callback ) {
          callback('Email bad writed')
          return
        }
      } else {
        ans += i!==0? `, ${values[i]}` : values[i]
      }
    }
  }
  ans += ')'
  if( callback ) {
    callback(false, ans)
  }
}

function validateNumber(number) {
  const re = /^[0-9]{7,12}$/;
  return re.test(String(number).toLowerCase());
}

function validateName(name) {
  const re = /^[a-z_]{2,30}$/;
  return re.test(String(name).toLowerCase());
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


function processAnswersString(err, res) {
  // console.log(err, res)
  if( err ) {
    console.log( err )
  } else {
    console.log( res )
  }
}

toStringSQLInsert( keys, values, typeData, processAnswersString )


/*el objetivo principal es desde el front en html se hacer un form, tenemos que encontrar la forma
que cuando subamos datos a la bd manual */