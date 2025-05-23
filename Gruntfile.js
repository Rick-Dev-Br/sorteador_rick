// Exporta a configuração do Grunt como módulo Node.js
module.exports = function(grunt) {
    
    // Inicializa a configuração do Grunt
    grunt.initConfig({
        // Carrega as configurações do package.json
        pkg: grunt.file.readJSON('package.json'),
        
        // Configuração do plugin grunt-contrib-less (compilador LESS)
        less: {
            // Configuração para ambiente de desenvolvimento
            development: {
                // Mapeamento de arquivos: LESS de origem -> CSS compilado
                files: {
                    'dev/styles/main.css': 'src/styles/main.less' // Compila para CSS não minificado
                }
            },
            // Configuração para ambiente de produção
            production: {   
                options: {
                    compress: true // Ativa minificação do CSS
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less' // Compila para CSS minificado
                }
            }
        },
        
        // Configuração do plugin grunt-contrib-watch (observador de arquivos)
        watch: {
            less: {
                files: ['src/styles/**/*.less'], // Observa todos arquivos .less na pasta
                tasks: ['less:development']     // Tarefa a executar quando houver mudanças
            },
            html: {
                files: ['src/index.html'], // Observa todos arquivos .html na pasta
                tasks: ['replace:dev']  // Tarefa a executar quando houver mudanças
            }
        },
        // Configuração do plugin grunt-replace (substituição de strings)
        replace: {
  dev: {  // Target "dev"
    options: {
        patterns: [
        {
        match: 'ENDERECO_DO_CSS',
        replacement: './styles/main.css'
        },
        {
        match: 'ENDERECO_DO_JS',
        replacement: '../src/scripts/main.js'
        }
    ]
    },
    files: [{
        expand: true,
        flatten: true,
        src: ['src/index.html'],
        dest: 'dev/'
    }]
},
  dist: {  // Target "dist"
    options: {
        patterns: [
            {
        match: 'ENDERECO_DO_CSS',
        replacement: './styles/main.min.css'
            },
            {
        match: 'ENDERECO_DO_JS',
        replacement: './scripts/main.min.js'
            }
    ]
    },
    files: [{
        expand: true,
        flatten: true,
        src: ['prebuild/index.html'],
        dest: 'dist/'
    }]
    }
},
        // Configuração do plugin grunt-contrib-htmlmin (minificação de HTML)
        htmlmin: {
            dist: {
                options: {
                    removeCommentTags: true,
                    collapseWhitespace: true,
                },
                files: {
                    'prebuild/index.html': 'src/index.html'   // Arquivo original e destino do arquivo minificado
                }
            }
        },
        // Configuração do plugin grunt-contrib-clean (limpeza de diretórios)
        clean: ['prebuild'],   // Diretório a ser limpo
        uglify: {
            target:{
                files: {
                    'dist/scripts/main.min.js': 'src/scripts/main.js'
                }
            }
        }
    })

    // Carrega os plugins necessários
    grunt.loadNpmTasks('grunt-contrib-less');   // Plugin para compilar LESS
    grunt.loadNpmTasks('grunt-contrib-watch');  // Plugin para observar arquivos
    grunt.loadNpmTasks('grunt-replace');  // Plugin para substituir strings 
    grunt.loadNpmTasks('grunt-contrib-htmlmin');  // Plugin para minificar HTML
    grunt.loadNpmTasks('grunt-contrib-clean');  // Plugin para limpar diretórios
    grunt.loadNpmTasks('grunt-contrib-uglify');  // Plugin para minificar JavaScript


    // Registra a tarefa padrão (executada quando digitar apenas 'grunt')
    grunt.registerTask('default', ['watch']); // Inicia o observador de arquivos
    
    // Registra a tarefa 'build' para produção
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']); // Compila versão minificada
};