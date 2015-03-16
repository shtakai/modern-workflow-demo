///<reference path="./references.d.ts" />

import Model = require('./model');

class View {

  private _container : string;
  private _templateUrl : string;
  private _templateCode : string = null;
  private _template : Function = null;
  private _model : Model;

  constructor(templateUrl : string, container : string, model : Model){
    this._container = container;
    this._templateUrl = templateUrl;
    this._model = model;
  }
  private readyUpTemplate(cb : (template : Function) => void){
    debugger;
    this.loadTemplate((tcode) => {
      this.compileTemplate((template) => {
        cb(template);
      });
    });
  }
  private loadTemplate(cb : (template : string) => void){
    if(this._templateCode === null){
      $.ajax({
        url : this._templateUrl,
        success : function(text) {
          cb(text);
        },
        error : function(error) {
          console.log(error);
        }
      });
    }
    else {
      cb(this._templateCode);
    }
  }
  private compileTemplate(cb : (template : Function) => void) {
    if(this._template === null){
      this._template = Handlebars.compile(this._templateCode);
    }
    cb(this._template);
  }
  private jsonToHtml(json : Object, cb : (html : string) => void) {
    this.readyUpTemplate((template : Function) => {
      var html = template(json);
      cb(html);
    });
  }
  public render(args : Object) {
    if(this._model !== null){
      this._model.get(args, (json) => {
        this.jsonToHtml(json, (html : string) => {
          $(this._container).html();
        });
      });
    }
    else {
      this.jsonToHtml({}, (html : string) => {
        $(this._container).html();
      });
    }
  }
}

export = View;
