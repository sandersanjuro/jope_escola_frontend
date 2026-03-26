'use strict';

// Defina os ambientes primeiro para que qualquer código que os leia saiba o ambiente correto.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Faz o script travar em rejeições não tratadas ao invés de ignorá-las silenciosamente.
// No futuro, rejeições de promessa que não forem tratadas terminarão o processo Node.js com um código de saída não zero.
process.on('unhandledRejection', err => {
  throw err;
});

// Assegure-se de que as variáveis de ambiente são lidas.
require('../config/env');

const fs = require('fs');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const semver = require('semver');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');
const getClientEnvironment = require('../config/env');
const react = require(require.resolve('react', { paths: [paths.appPath] }));

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Aviso e falha se os arquivos necessários estiverem faltando
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Ferramentas como Cloud9 dependem disso.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Tentando vincular à variável de ambiente HOST: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `Se isso foi não intencional, verifique se você não definiu isso por engano no seu shell.`
  );
  console.log(
    `Saiba mais aqui: ${chalk.yellow('https://cra.link/advanced-config')}`
  );
  console.log();
}

// Exigimos que você defina explicitamente os navegadores e não volte aos padrões do browserslist.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // Tentamos usar a porta padrão, mas se estiver ocupada, oferecemos ao usuário para
    // executar em uma porta diferente. O `choosePort()` Promise resolve para a próxima porta livre.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then(port => {
    if (port == null) {
      // Não encontramos uma porta.
      return;
    }

    const config = configFactory('development');
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;

    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const urls = prepareUrls(
      protocol,
      HOST,
      port,
      paths.publicUrlOrPath.slice(0, -1)
    );
    // Cria um compilador webpack que é configurado com mensagens personalizadas.
    const compiler = createCompiler({
      appName,
      config,
      urls,
      useYarn,
      useTypeScript,
      webpack,
    });
    // Carrega a configuração do proxy
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(
      proxySetting,
      paths.appPublic,
      paths.publicUrlOrPath
    );
    // Serve os ativos webpack gerados pelo compilador através de um servidor web.
    const serverConfig = {
      ...createDevServerConfig(proxyConfig, urls.lanUrlForConfig),
      host: HOST,
      port,
    };
    const devServer = new WebpackDevServer(serverConfig, compiler);
    // Lança o WebpackDevServer.
    devServer.startCallback(() => {
      if (isInteractive) {
        clearConsole();
      }

      if (env.raw.FAST_REFRESH && semver.lt(react.version, '16.10.0')) {
        console.log(
          chalk.yellow(
            `O Fast Refresh requer React 16.10 ou superior. Você está usando React ${react.version}.`
          )
        );
      }

      console.log(chalk.cyan('Iniciando o servidor de desenvolvimento...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });

    if (process.env.CI !== 'true') {
      // Saída graciosa quando stdin termina
      process.stdin.on('end', function () {
        devServer.close();
        process.exit();
      });
    }
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
