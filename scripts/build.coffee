fs    = require 'fs'
path  = require 'path'
child = require 'child_process'

fsExistsSync = fs.existsSync || path.existsSync

getBinaryPath = (binary) ->
  binary_path = path.join('node_modules', '.bin', binary)
  if fsExistsSync binary_path
    return binary_path

  binary_path = path.join('..', '.bin', binary)
  if fsExistsSync binary_path
    return binary_path

  return binary


rmdir = (dir) ->
  list = fs.readdirSync dir
  for entry in list
    remove(dir, entry)

  fs.rmdirSync dir


remove = (dir, entry) ->
  filename = path.join(dir, entry)
  stat = fs.statSync filename
  if entry is '.' or entry is '..'
    #
  else if stat.isDirectory()
    rmdir filename
  else
    fs.unlinkSync filename


isdir = (dir) ->
  try
    fs.statSync(dir).isDirectory()
  catch
    false

if isdir 'src'
  rmdir 'lib' if isdir 'lib'

  coffee_bin = getBinaryPath 'coffee'
  babel_bin = getBinaryPath 'babel'

  child.exec "#{coffee_bin} -b -c -o lib/ src/", (err) ->
    if err
      console.error err
    else
      child.exec "#{babel_bin} src --out-dir lib", (err) ->
        if err
          console.error err
