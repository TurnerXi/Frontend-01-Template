const stdin = process.stdin;
const stdout = process.stdout;
const noop = () => { }

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf-8');
stdin.on('data', (key) => {
  if (key === '\u0003') {
    process.exit(0);
  }
})

function input(key) {
  if (key === '\r') {
    stdout.write('\r\n');
  } else {
    stdout.write(key);
  }
}
function list(config) {
  const { message = '', choices = [], confirm = noop } = config;
  stdout.write(message + '\n');
  const size = choices.length;
  let choice = config.default || choices[0];
  let selectIdx = choices.indexOf(choice);

  const print = () => {
    for (let i = 0; i < choices.length; i++) {
      let strs = [];
      strs.push(i === selectIdx ? '\x1B[96m>' : ' ');
      strs.push(choices[i]);
      let str = strs.join(' ');
      if (i < size - 1) {
        stdout.write(str + '\x1B[0m\n');
      } else {
        stdout.write(str + '\x1B[0m');
        moveright(100 - str.length);
      }
    }
  }
  print();

  return new Promise(resolve => {
    const ondata = function (key) {
      if (key === '\r') {
        stdout.write('\n');
        stdin.off('data', ondata);
        resolve(choice);
      } else if (key === '\033[A') {
        if (selectIdx > 0) {
          selectIdx--;
          choice = choices[selectIdx];
          moveleft(100);
          moveup(size - 1);
          print();
        }
      } else if (key === '\033[B') {
        if (selectIdx < size - 1) {
          selectIdx++;
          choice = choices[selectIdx];
          moveleft(100);
          moveup(size - 1);
          print();
        }
      }
    }
    stdin.on('data', ondata)
  })

}

function moveup(num = 1) {
  stdout.write('\033[' + num + 'A');
}
function movedown(num = 1) {
  stdout.write('\033[' + num + 'B');
}
function moveleft(num = 1) {
  stdout.write('\033[' + num + 'D');
}
function moveright(num = 1) {
  stdout.write('\033[' + num + 'C');
}

void async function start() {
  var result = await list({
    message: 'which framework do you want to use ?',
    choices: ['vue', 'react', 'angular'],
    default: 'vue'
  })
  console.log(result);
  await list({
    message: 'which framework do you want to use ?',
    choices: ['vue', 'react', 'angular'],
    default: 'vue'
  })
}()
// stdout.write("Hello world!\n");
// stdout.write("\033[1A");
// stdout.write("turner");