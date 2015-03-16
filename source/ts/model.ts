///<reference path="./references.d.ts" />

class Model {

  private _modelUrl : string;
  private _formatter : (response : Object) => Object;

  constructor(moduleUrl : string, formatter : (response : Object) => Object) {
    this._modelUrl = moduleUrl;
    this._formatter = formatter;
  }
  private genericAjaxCall(method : string, args : Object, cb : (response : Object) => void){
    $.ajax({
      url : this._modelUrl,
      data : args,
      success : (response : Object) => {
        if(typeof this._formatter === "function"){
          response = this._formatter(response);
        }
        cb(response);
      },
      error : function(error) {
        console.log(error);
      }
    });
  }
  public get(args : Object, cb : (response : Object) => void) {
    this.genericAjaxCall("GET", args, cb);
  }
}

export = Model;
