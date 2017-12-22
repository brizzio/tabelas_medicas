
let db = 'hospitalar';
let tuss = 'tuss_depara';
let mlaburl = "https://api.mlab.com/api/1/databases/"
let apiKey='OdK4Ro6jWpHlQULe2f__7UXDcTnZBYtg';
var pesquisa
var json = '';
var objhtml={};


$(document).ready(function(){       
    console.log('jquery pronto!!');
    
   
    
    $('#buscaProcedimentoTuss').on('keyup', function(e){
        e.stopImmediatePropagation();
        let procedimento = e.target.value;
        console.log(procedimento + '...'+  $(this).val().length);
        if ( $(this).val().length > 3){
                
            //[q=<query>][&c=true][&f=<fields>][&fo=true][&s=<order>][&sk=<skip>][&l=<limit>]
            //c=true - return the result count for this query
            //f=<set of fields> - specify the set of fields to include or exclude in each document (1 - include; 0 - exclude)
            //fo=true - return a single document from the result set (same as findOne() using the mongo shell
            //urlq = urlq + '&s={"descricao" :1}'; // - specify the order in which to sort each specified field (1- ascending; -1 - descending)
            //sk=<num results to skip> - specify the number of results to skip in the result set; useful for paging
            if(pesquisa){pesquisa.abort()}
            var query = JSON.stringify({descricao:{$regex:procedimento, $options: 'i'}});
            var sorts = JSON.stringify({descricao:1});
            var url = mlaburl + db +"/collections/"+tuss+"/?q=" + query + "&s="+ sorts + "&l=20&apiKey=" + apiKey
            
            $('#result').html('');

            var htmldata=[];
            
            

            var pesquisa = getHttpRequestPromise(url)
            
            pesquisa.then(function(dados){
                let htmlo = '';
                $.each(dados, function(index,obj){
                    var dataObject = {}
                    console.log('obj:' + index + '=== busca corresp para: ' + obj.tuss + '/' + obj.descricao)
                    let objdiv = '';
                    let arrayOfPromises=[
                             correspondente('amb90', obj.amb90),
                             correspondente('amb92', obj.amb92),
                             correspondente('amb96', obj.amb96),
                             correspondente('amb99', obj.amb99),
                             correspondente('cbhpm3', obj.cbhpm3),
                             correspondente('cbhpm4', obj.cbhpm4),
                             correspondente('cbhpm5', obj.cbhpm5)
                    ]
                    
                    Promise.all(arrayOfPromises.map(p => p.catch(e => e)))
                    .then(function(results){
                        
                        let de= {
                            amb90:results.filter(function(filtrado){return filtrado.tabela == 'amb90';})[0],
                            amb92:results.filter(function(filtrado){return filtrado.tabela == 'amb92';})[0],
                            amb96:results.filter(function(filtrado){return filtrado.tabela == 'amb96';})[0],
                            amb99:results.filter(function(filtrado){return filtrado.tabela == 'amb99';})[0],
                            cbhpm3:results.filter(function(filtrado){return filtrado.tabela == 'cbhpm3';})[0],
                            cbhpm4:results.filter(function(filtrado){return filtrado.tabela == 'cbhpm4';})[0],
                            cbhpm5:results.filter(function(filtrado){return filtrado.tabela == 'cbhpm5';})[0]
                        }    

                        let newdiv = `
                        <div class="card border-light mb-3" style="min-width: 20rem;">
                        <div class="card-header"><strong>TUSS:   </strong>${obj.tuss}</div>
                        <div class="card-body">
                        <h4 class="card-title">${obj.descricao}</h4> 

                        <p class="card-text">Correspondências em outras tabelas médicas:</p>
                        <p class="card-text"><strong>AMB90:  </strong><span id="span-amb90">${de.amb90.titulo}</span><span id="amb90"><span class="badge badge-primary">Porte: ${de.amb90.porte}</span><span class="badge badge-secondary">Porte Anestesico: ${de.amb90.porteanestesico}</span><span class="badge badge-success">Auxiliares: ${de.amb90.aux}</span><span class="badge badge-danger">CH: ${de.amb90.ch}</span></span></p>
                        <p class="card-text"><strong>AMB92:  </strong><span id="span-amb92">${de.amb92.titulo}</span><span id="amb92"><span class="badge badge-primary">Porte: ${de.amb92.porte}</span><span class="badge badge-secondary">Porte Anestesico: ${de.amb92.porteanestesico}</span><span class="badge badge-success">Auxiliares: ${de.amb92.aux}</span><span class="badge badge-danger">CH: ${de.amb92.ch}</span></span></p>
                        <p class="card-text"><strong>AMB96:  </strong><span id="span-amb96">${de.amb96.titulo}</span><span id="amb96"><span class="badge badge-primary">Porte: ${de.amb96.porte}</span><span class="badge badge-secondary">Porte Anestesico: ${de.amb96.porteanestesico}</span><span class="badge badge-success">Auxiliares: ${de.amb96.aux}</span><span class="badge badge-danger">CH: ${de.amb96.ch}</span></span></p>
                        <p class="card-text"><strong>AMB99:  </strong><span id="span-amb99">${de.amb99.titulo}</span><span id="amb99"><span class="badge badge-primary">Porte: ${de.amb99.porte}</span><span class="badge badge-secondary">Porte Anestesico: ${de.amb99.porteanestesico}</span><span class="badge badge-success">Auxiliares: ${de.amb99.aux}</span><span class="badge badge-danger">CH: ${de.amb99.ch}</span></span></p>
                        <p class="card-text"><strong>CBHPM 3 edição:  </strong><span id="span-cbhpm3">${de.cbhpm3.titulo}</span><span id="cbhpm3"><span class="badge badge-primary">Porte: ${de.cbhpm3.porte}</span><span class="badge badge-secondary">Porte Anestesico: ${de.cbhpm3.porteanestesico}</span><span class="badge badge-success">Auxiliares: ${de.cbhpm3.aux}</span><span class="badge badge-danger">CH: ${de.cbhpm3.ch}</span></span></p>
                        <p class="card-text"><strong>CBHPM 4 edição:  </strong><span id="span-cbhpm4">${de.cbhpm4.titulo}</span><span id="cbhpm4"><span class="badge badge-primary">Porte: ${de.cbhpm4.porte}</span><span class="badge badge-secondary">Porte Anestesico: ${de.cbhpm4.porteanestesico}</span><span class="badge badge-success">Auxiliares: ${de.cbhpm4.aux}</span><span class="badge badge-danger">CH: ${de.cbhpm4.ch}</span></span></p>
                        <p class="card-text"><strong>CBHPM 5 edição:  </strong><span id="span-cbhpm5">${de.cbhpm5.titulo}</span><span id="cbhpm5"><span class="badge badge-primary">Porte: ${de.cbhpm5.porte}</span><span class="badge badge-secondary">Porte Anestesico: ${de.cbhpm5.porteanestesico}</span><span class="badge badge-success">Auxiliares: ${de.cbhpm5.aux}</span><span class="badge badge-danger">CH: ${de.cbhpm5.ch}</span></span></p>
                        
                        </div>  

                        `
                        
                        $('#result').append(newdiv)                
                        
                        
                        htmldata.push(JSON.parse(JSON.stringify(dataObject)));
       
                       
                    }).catch(e => console.log('tem erro aqui====>' + e));
                    
                    console.log(typeof htmldata)
                    console.log(htmldata)
                });
             

            })
            
        }

    });
    
});


    //global functions

    function getHttpRequestPromise(endpoint){
        //console.log('request to: ' + endpoint);
        return new Promise(function(resolve, reject) {
             var xhr = new XMLHttpRequest();
             xhr.open('GET', endpoint, true);
             xhr.onload = function(){
                 if (this.status==200){
                    resolve(JSON.parse(this.responseText));
                 }else{
                     reject(xhr);
                 }
             }
             xhr.send();
         });
    }

    function correspondente(tabela, codigo){
        return new Promise(function(resolve, reject) {
             let objResposta = {
                 tabela:'',
                 titulo:'',
                 aux:'',
                 ch: '',
                 codigo:'',
                 crr:'',
                 custoperacional:'',
                 descricao:'',
                 filmes:'',
                 honorarios:'',
                 incidencia:'',
                 peso:'',
                 porte:'',
                 porteanestesico:'',
                 ur:''
            }   
                if(codigo!==''){

                    //console.log('vai ver a tabela: ' + tabela + ' buscandocodigo: ' + codigo)
                    var query = JSON.stringify({codigo:codigo});
                    var url= mlaburl + db +"/collections/"+ tabela +"/?q=" + query  + "&l=1&apiKey=" + apiKey
                    let stringdata = ''

                    getHttpRequestPromise(url).then(function(proc){
                        //console.log(proc[0]);
                        proc=proc[0];
                        objResposta.tabela = tabela
                        objResposta.titulo = '(' + proc.codigo + ') - ' + proc.descricao
                        objResposta.aux=proc.aux
                        objResposta.ch=proc.ch
                        objResposta.codigo=proc.codigo
                        objResposta.crr=proc.crr
                        objResposta.custoperacional=proc.custoperacional
                        objResposta.descricao=proc.descricao
                        objResposta.filmes=proc.filmes
                        objResposta.honorarios=proc.honorarios
                        objResposta.incidencia=proc.incidencia
                        objResposta.peso=proc.peso
                        objResposta.porte=proc.porte
                        objResposta.porteanestesico=proc.porteanestesico
                        objResposta.ur=proc.ur
                        
                        //console.log(objResposta);
                        resolve(objResposta) 


                    }).catch(function(err){console.log('deu erro buscando ' + tabela + ' // ' + codigo)})   

                                      
                }else{
                    objResposta.tabela = tabela
                    objResposta.titulo = 'Não tem correspondencia'
                    reject(objResposta);
                }
        });        
    }

    
