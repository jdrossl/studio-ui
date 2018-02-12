CStudioForms.Controls.AWSFileUpload = CStudioForms.Controls.AWSFileUpload ||  
function(id, form, owner, properties, constraints, readonly)  {
  this.owner = owner;
  this.owner.registerField(this);
  this.errors = []; 
  this.properties = properties;
  this.constraints = constraints;
  this.fileEl = null;
  this.inputEl = null;
  this.required = false;
  this.value = "_not-set";
  this.form = form;
  this.id = id;
  this.readonly = readonly;
  
  if(properties) {
    var required = constraints.find(function(property){ return property.name === "required"; });
    if(required) {
      this.required = required.value === "true";
    }
    var profile_id = properties.find(function(property){ return property.name === "profile_id"; });
    if(profile_id) {
      this.profile_id = profile_id.value;
    }
  }
  
  return this;
};

YAHOO.extend(CStudioForms.Controls.AWSFileUpload, CStudioForms.CStudioFormField, {
  
  getLabel: function() {
    return "AWS File Upload";
  },
  
  getName: function() {
    return "aws-file-upload";
  },
  
  setValue: function(value) {
    var validationResult = true;
    if(value && value[0] && value[0].key) {
      this.value = value;
      this.form.updateModel(this.id, this.value);
      this.fileEl.innerHTML = "s3://" + value[0].bucket + "/" + value[0].key + "*";
      this.clearError("required");
    } else if(this.required) {
      validationResult = false;
      this.setError("required", "Field is Required");
    }
    this.renderValidation(true, validationResult);
    this.owner.notifyValidation();
  },
  
  getValue: function() {
    return this.value;
  },
  
  getSupportedProperties: function() {
    return [
      { label: "Profile ID", name: "profile_id", type: "string", defaultValue: "s3-default" }
    ];
  },
  
  getSupportedConstraints: function() {
    return [
      { label: CMgs.format(langBundle, "required"), name: "required", type: "boolean" }
    ];
  },
  
  _onChange: function(evt, obj) {
    var serviceUri = CStudioAuthoring.Service.createServiceUri("/api/1/services/api/1/aws/s3/upload.json");

    var callback = { 
      cache: false,
      upload: function(o) {
        document.getElementById("cstudioSaveAndClose").disabled="";
        document.getElementById("cstudioSaveAndCloseDraft").disabled="";
        document.getElementById("cstudioSaveAndPreview").disabled="";
        document.getElementById("cancelBtn").disabled="";
        try {
          var data = JSON.parse(o.responseText);
          if(data.hasError) {
            CStudioAuthoring.Operations.showSimpleDialog(
                "error-dialog",
                CStudioAuthoring.Operations.simpleDialogTypeINFO,
                "Notification",
                data.errors.join(", "),
                null,
                YAHOO.widget.SimpleDialog.ICON_BLOCK,
                "studioDialog"
            );
          } else {
            obj.setValue(data);
            obj.edited = true;
          }
        } catch(err) {
          obj.fileEl.innerHTML = "";
          CStudioAuthoring.Operations.showSimpleDialog(
              "error-dialog",
              CStudioAuthoring.Operations.simpleDialogTypeINFO,
              "Notification",
              err.message,
              null,
              YAHOO.widget.SimpleDialog.ICON_BLOCK,
              "studioDialog"
          );
        }
      },
      failure: function(o) {
        obj.fileEl.innerHTML = "";
        document.getElementById("cstudioSaveAndClose").disabled="";
        document.getElementById("cstudioSaveAndCloseDraft").disabled="";
        document.getElementById("cstudioSaveAndPreview").disabled="";
        document.getElementById("cancelBtn").disabled="";
        CStudioAuthoring.Operations.showSimpleDialog(
            "error-dialog",
            CStudioAuthoring.Operations.simpleDialogTypeINFO,
            "Notification",
            "File upload failed due to a unknown error.",
            null,
            YAHOO.widget.SimpleDialog.ICON_BLOCK,
            "studioDialog"
        );
      }
    };

    YAHOO.util.Connect.setForm("upload_form_" + obj.id, true);
    serviceUri += "&" + CStudioAuthoringContext.xsrfParameterName + "=" + CStudioAuthoringContext.xsrfToken;    
    YAHOO.util.Connect.asyncRequest("POST", serviceUri, callback);
    document.getElementById("cstudioSaveAndClose").disabled="disabled";
    document.getElementById("cstudioSaveAndCloseDraft").disabled="disabled";
    document.getElementById("cstudioSaveAndPreview").disabled="disabled";
    document.getElementById("cancelBtn").disabled="disabled";
    obj.fileEl.innerHTML = "<i class=\"fa fa-spinner fa-spin\"/>";
  },
  
  listFiles: function(evt, obj) {
      var listUrl = CStudioAuthoring.Service.createServiceUri("/api/1/services/api/1/aws/s3/list.json");
      listUrl += "&site=" + CStudioAuthoringContext.siteId;
      listUrl += "&profile=" + obj.profile_id;
      listUrl += "&" + CStudioAuthoringContext.xsrfParameterName + "=" + CStudioAuthoringContext.xsrfToken;
      var listButton = document.getElementById("list_button_" + obj.id);
      var callback = {
          success: function(o) {
              var fileList = document.getElementById("file_list_" + obj.id);
              var data = JSON.parse(o.responseText);
              var list = document.getElementById("file_list_" + obj.id);
              data.keys.forEach(function(key) {
                  var itemNode = document.createElement("div");
                  itemNode.innerText = key;
                  YAHOO.util.Dom.addClass(itemNode, "cstudio-form-control-node-selector-item");
                  YAHOO.util.Event.on(itemNode, "click", function(evt){
                      var value = [ { key: evt.target.innerText, bucket: data.bucket } ];
                      obj.setValue(value);
                      obj.edited = true;
                      YAHOO.util.Dom.addClass(list, "hidden");
                      YAHOO.util.Dom.removeClass(listButton, "hidden");
                  });
                  list.appendChild(itemNode);
              });
              YAHOO.util.Dom.removeClass(list, "hidden");
          }
      };
      YAHOO.util.Dom.addClass(listButton, "hidden");
      YAHOO.util.Connect.asyncRequest("GET", listUrl, callback);
  },
  
  render: function(config, containerEl, lastTwo) {    
    var titleEl = document.createElement("span");
		YAHOO.util.Dom.addClass(titleEl, "cstudio-form-field-title");
		titleEl.innerHTML = config.title;
    containerEl.appendChild(titleEl);
    
    var controlWidgetContainerEl = document.createElement("div");
		YAHOO.util.Dom.addClass(controlWidgetContainerEl, "cstudio-form-control-input-container");
    
    var validEl = document.createElement("span");
		YAHOO.util.Dom.addClass(validEl, "validation-hint");
		YAHOO.util.Dom.addClass(validEl, "cstudio-form-control-validation fa fa-check");
		controlWidgetContainerEl.appendChild(validEl);

    this.fileEl = document.createElement("span");
    controlWidgetContainerEl.appendChild(this.fileEl);
    
    var formEl = document.createElement("form");
    formEl.id = "upload_form_" + this.id;
    
    var profileEl = document.createElement("input");
    profileEl.type = "hidden";
    profileEl.name = "profile";
    profileEl.value = this.profile_id;
    
    formEl.appendChild(profileEl);
    
    var siteEl = document.createElement("input");
    siteEl.type = "hidden";
    siteEl.name = "site";
    siteEl.value = CStudioAuthoringContext.site;
    
    formEl.appendChild(siteEl);
    
    var inputEl = document.createElement("input");
		this.inputEl = inputEl;
    inputEl.type = "file";
    inputEl.name = "file";
		YAHOO.util.Dom.addClass(inputEl, "datum");
		YAHOO.util.Dom.addClass(inputEl, "cstudio-form-control-input");
    YAHOO.util.Event.on(inputEl, "change",  this._onChange, this);
    
		formEl.appendChild(inputEl);
    
    controlWidgetContainerEl.appendChild(formEl);
    
    containerEl.appendChild(controlWidgetContainerEl);
    
    var emptyEl = document.createElement("span");
		YAHOO.util.Dom.addClass(emptyEl, "cstudio-form-field-title");
		emptyEl.innerHTML = ".";
    containerEl.appendChild(emptyEl);
    
    var listWidgetContainerEl = document.createElement("div");
    YAHOO.util.Dom.addClass(listWidgetContainerEl, "cstudio-form-control-input-container");
    
    var spaceEl = document.createElement("span");
    YAHOO.util.Dom.addClass(spaceEl, "validation-hint");
    YAHOO.util.Dom.addClass(spaceEl, "cstudio-form-control-validation");
    listWidgetContainerEl.appendChild(spaceEl);
    
    var listButton = document.createElement("input");
    listButton.id = "list_button_" + this.id;
    listButton.type = "button";
    listButton.value = "Select Existing";
    YAHOO.util.Dom.addClass(listButton, "cstudio-button");
    YAHOO.util.Event.on(listButton, "click",  this.listFiles, this);
    listWidgetContainerEl.appendChild(listButton)
    
    var fileList = document.createElement("div");
    fileList.id = "file_list_" + this.id;
    YAHOO.util.Dom.addClass(fileList, "cstudio-form-control-node-selector-items-container");
    YAHOO.util.Dom.addClass(fileList, "hidden");
    
    listWidgetContainerEl.appendChild(fileList);
    
    containerEl.appendChild(listWidgetContainerEl);
  }
  
});

CStudioAuthoring.Module.moduleLoaded("cstudio-forms-controls-aws-file-upload", CStudioForms.Controls.AWSFileUpload);