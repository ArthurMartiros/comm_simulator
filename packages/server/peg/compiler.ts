import * as Path from 'path';
import * as Fs   from 'fs';
import * as Peg  from 'pegjs';
const outDir = './build/sip/pegjs';
const grammarDir = Path.resolve('./peg');
const outputPath = Path.resolve( outDir, 'grammar.js');
if (!Fs.existsSync(outDir)) {
  Fs.mkdirSync(outDir, 0o744);
}


console.info("GrammarDir :", grammarDir);
console.info("OutputPath :", outputPath);

class Compiler {
  static run(): Compiler {
    return new Compiler().run();
  }

  private header: string;
  private wrapper: string;
  private grammar: string;
  private config: any;

  private readConfig() {
    this.config = JSON.parse(Fs.readFileSync(
      Path.resolve(grammarDir, 'config.json'), 'utf8'
    ));
  }

  private readHeader() {
    this.header = Fs.readFileSync(
      Path.resolve(grammarDir, 'header.js'), 'utf8'
    );
  }

  private readGrammar() {
    this.grammar = Fs.readFileSync(
      Path.resolve(grammarDir, 'grammar.pegjs'), 'utf8'
    );
  }

  private readWrapper() {
    this.wrapper = Fs.readFileSync(
      Path.resolve(grammarDir, 'wrapper.js'), 'utf8'
    );
  }

  private read() {
    this.readConfig();
    this.readHeader();
    this.readGrammar();
    this.readWrapper();
  }

  private get source(): string {
    return [
      '// Header',
      '{', this.header, '}',
      '',
      '// Grammar ',
      this.grammar
    ].join('\n')
  }

  log(message, data?) {
    console.info(message);
    if (typeof data != 'undefined') {
      console.info(data);
    }
  }

  debug(message, data?) {
    if (this.config.debug) {
      this.log(message, data);
    }
  }

  getGrammarFor(location) {
    var line = location.start.line;
    var startLine = line - 2;
    var endLine = line + 3;
    return this.source
      .split('\n')
      .slice(startLine, endLine)
      .map((l, i) => {
        var num = (startLine + i);
        if (num == line) {
          return `  \${num} | ${l}`
        } else {
          return `  ${(num + ' | ' + l)}`
        }

      }).join('\n');
  }

  compile(path: string): boolean {
    try {
      //this.debug('-- CONFIG  ',this.config);
      //this.debug('-- SOURCE  ',this.source);
      //this.debug('-- WRAPPER ',this.wrapper);
      var result = Peg.buildParser(this.source, this.config).trim();
      //this.debug('-- RESULT  ',result);

      var [header, footer] = this.wrapper.split('GRAMMAR.PEG.TEMPLATE');
      var output = [header, result, footer].join('');
      //this.debug('-- OUTOUT  ',output);
      Fs.writeFileSync(outputPath, output, 'utf8');
      this.log(`COMPILED : ${path}`);
      return true;
    } catch (err) {
      this.log(`FAILED   : ${path}`);
      console.info(`err.message`);
      console.info(this.getGrammarFor(err.location));
      return false;
    }
  }

  watch() {
    this.log(`WATCHING : ${grammarDir}`);
    Fs.watch(grammarDir, {persistent: true}, (e, f) => {
      var recompile = true;
      switch (f) {
        case 'header.js'     :
          this.readHeader();
          break;
        case 'wrapper.js'    :
          this.readWrapper();
          break;
        case 'grammar.pegjs' :
          this.readGrammar();
          break;
        case 'config.json'   :
          this.readConfig();
          break;
        default              :
          recompile = false;
      }
      if (recompile) {
        this.compile(Path.resolve(grammarDir, f));
      } else {
        this.log(`IGNORED  : ${f}`);
      }
    });
  }

  run(): Compiler {
    this.read();
    this.compile('file:' + grammarDir + '/grammar.pegjs');
    if (process.argv.indexOf('-w') >= 0) {
      this.watch();
    }
    return this;
  }

}

Compiler.run();