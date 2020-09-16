/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

CStudioAuthoring.Module.requireModule(
  'ace',
  '/static-assets/components/cstudio-common/ace/ace.js',
  {},
  {
    moduleLoaded: function () {
      CStudioAuthoring.Utils.addCss('/static-assets/themes/cstudioTheme/css/template-editor.css');
      CStudioAuthoring.Utils.addJavascript('/static-assets/components/cstudio-common/ace/ext-language_tools.js');

      CStudioAuthoring.Module.requireModule(
        'cstudio-forms-engine',
        '/static-assets/components/cstudio-forms/forms-engine.js',
        {},
        {
          moduleLoaded: function () {
            CStudioForms.TemplateEditor =
              CStudioForms.TemplateEditor ||
              function () {
                return this;
              };

            var CMgs = CStudioAuthoring.Messages;
            var contextNavLangBundle = CMgs.getBundle('contextnav', CStudioAuthoringContext.lang);

            const i18n = CrafterCMSNext.i18n,
              formatMessage = i18n.intl.formatMessage,
              messages = i18n.messages.codeEditorMessages,
              words = i18n.messages.words;

            var codeSnippets = {
              freemarker: {
                'content-variable': {
                  label: 'Content variable',
                  value: '${contentModel.VARIABLENAME}'
                },
                'request-parameter': {
                  label: 'Request parameter',
                  value: '${RequestParameters["PARAMNAME"]!"DEFAULT"}'
                },
                'studio-support': {
                  label: 'Studio support',
                  value:
                    '<#import "/templates/system/common/cstudio-support.ftl" as studio />\r\n\t...\r\n\t<@studio.toolSupport />'
                },
                'dynamic-navigation': {
                  label: 'Dynamic navigation',
                  value:
                    '<#include "/templates/web/navigation/navigation.ftl">\r\n\t...\r\n\t<@renderNavigation "/site/website", 1 />'
                },
                'transform-path-to-url': {
                  label: 'Transform PATH to URL',
                  value: '${urlTransformationService.transform(\'storeUrlToRenderUrl\', STOREURL)}'
                },

                'ice-attr': {
                  label: 'Incontext editing attribute (pencil)',
                  value: '<@studio.iceAttr iceGroup="ICEGROUID"/>'
                },
                'component-dropzone-attr': {
                  label: 'Component DropZone attribute',
                  value: '<@studio.componentContainerAttr target="TARGETID" objectId=contentModel.objectId />'
                },
                'component-attr': {
                  label: 'Component attribute',
                  value: '<@studio.componentAttr path=contentModel.storeUrl ice=false />'
                },
                'render-components-list': {
                  label: 'Render list of components',
                  value:
                    '<#list contentModel.VARIABLENAME.item as module>\r\n\t<@renderComponent component=module />\r\n</#list>'
                },
                'iterate-items-list-load-content-item': {
                  label: 'Iterate over a list of items and load content item',
                  value:
                    '<#list contentModel.VARIABLENAME.item as myItem>\r\n\t<#assign myContentItem =  siteItemService.getSiteItem(myItem.key) />\r\n\t${myContentItem.variableName}\r\n</#list>'
                },
                'iterate-repeat-group': {
                  label: 'Iterate over repeat group',
                  value: '<#list contentModel.VARIABLENAME.item as row>\r\n\t${row.VARIABLENAME}\r\n</#list>'
                },

                'freemarker-value-assignment': {
                  label: 'Freemarker value assignment',
                  value: '<#assign imageSource = contentModel.image!"" />'
                },
                'freemarker-if': {
                  label: 'Freemarker value IF',
                  value: '<#if CONDITION>\r\n\t...\r\n</#if>'
                },
                'freemarker-loop': {
                  label: 'Freemarker value LOOP',
                  value: '<#list ARRAY as value>\r\n\t${value_index}: ${value}\r\n</#list>'
                },
                'freemarker-fragment-include': {
                  label: 'Freemarker Fragment include',
                  value: '<#include "/templates/PATH" />'
                },
                'freemarker-library-import': {
                  label: 'Freemarker Library import',
                  value: '<#import "/templates/PATH" as NAMESPACE />'
                },

                'html-page': {
                  label: 'HTML Page',
                  value:
                    '<#import "/templates/system/common/cstudio-support.ftl" as studio />\r\n<html lang="en">\r\n<head>\r\n\t</head>\r\n\t<body>\r\n\t\t<h1>CONTENT HERE</h1>\r\n\t<@studio.toolSupport/>\r\n\t</body>\r\n</html>'
                },
                'html-component': {
                  label: 'HTML Component',
                  value:
                    '<#import "/templates/system/common/cstudio-support.ftl" as studio />\r\n<div <@studio.componentAttr path=contentModel.storeUrl ice=false /> >\r\nCOMPONENT MARKUP</div>'
                }
              },
              groovy: {
                'access-content-model': { label: 'Access Content Model', value: 'contentModel' },
                'access-template-model': { label: 'Access Template Model', value: 'templateModel' },

                'current-site-id': { label: 'Current Site ID', value: 'siteContext.siteName' },
                'request-parameters': { label: 'Request Parameters', value: 'params' },
                'cookies': { label: 'Cookies', value: 'cookies' },
                'http-request': { label: 'HTTP Request', value: 'request' },
                'http-response': { label: 'HTTP Response', value: 'response' },
                'session': { label: 'Session', value: 'session' },
                'transform-path-to-url': {
                  label: 'Transform PATH to URL',
                  value: 'urlTransformationService.transform(\'storeUrlToRenderUrl\', STOREURL)'
                },

                'user-profile': { label: 'User Profile', value: 'profile' },
                'current-authentication': {
                  label: 'Current Authentication',
                  value: 'authentication'
                },

                'log-info': { label: 'Log an INFO', value: 'logger.info(\'MY MESSAGE\')' },
                'log-error': { label: 'Log an ERROR', value: 'logger.error(\'MY MESSAGE\')' },

                'search-service': { label: 'Search Service', value: 'searchService' },
                'site-item-service': { label: 'Site Item Service', value: 'siteItemService' },
                'profile-service': { label: 'Profile Service', value: 'profileService' },

                'get-spring-bean': {
                  label: 'Get Spring Bean',
                  value: 'applicationContext.get("SPRING_BEAN_NAME")'
                }
              }
            };

            CStudioForms.TemplateEditor.prototype = {
              render: function (templatePath, channel, onSaveCb, contentType, mode) {
                var me = this;

                Promise.all([
                    CrafterCMSNext.services.configuration
                      .getDOM(CStudioAuthoringContext.site, '/code-editor-config.xml', 'studio')
                      .toPromise(),
                    new Promise((resolve, reject) => {
                      CStudioAuthoring.Service.getContent(templatePath, true, {
                        success: resolve,
                        failure: reject
                      });
                    })
                  ])
                  .then(([xmlDoc, content]) => {
                    CStudioForms.TemplateEditor.config = xmlDoc;
                    if (xmlDoc) {
                      me.addSnippets(xmlDoc);
                    }
                    me.renderTemplateEditor(templatePath, content, onSaveCb, contentType, mode);
                  })
                  .catch((error) => {
                    const errorMsg = error.responseText
                      ? JSON.parse(error.responseText).message
                      : `${error.response.response.message}. ${error.response.response.remedialAction}`;

                    CStudioAuthoring.Operations.showSimpleDialog(
                      'pasteContentFromClipboardError-dialog',
                      CStudioAuthoring.Operations.simpleDialogTypeINFO,
                      CMgs.format(formsLangBundle, 'notification'),
                      errorMsg,
                      [
                        {
                          text: 'OK',
                          handler: function () {
                            this.hide();
                            callback.failure(response);
                          },
                          isDefault: false
                        }
                      ],
                      YAHOO.widget.SimpleDialog.ICON_BLOCK,
                      'studioDialog'
                    );
                  });
              },

              addSnippets: (xmlDoc) => {
                snippets = xmlDoc.querySelectorAll('snippets snippet');

                Array.from(snippets).forEach((snippet) => {
                  const key = snippet.querySelector('key').innerHTML,
                    label = snippet.querySelector('label').innerHTML,
                    content = snippet.querySelector('content').textContent.trim(), // trim to remove empty spaces at beginning and end of the content (added because of CDATA)
                    type = snippet.querySelector('type').innerHTML,
                    entry = {
                      label,
                      value: content
                    };

                  codeSnippets[type][key] = entry;
                });
              },

              renderTemplateEditor: function (templatePath, content, onSaveCb, contentType, isRead) {
                const me = this;
                var permsCallback = {
                  success: function (response) {
                    var isWrite = CStudioAuthoring.Service.isWrite(response.permissions);

                    var modalEl = document.createElement('div');
                    modalEl.className = `cstudio-template-editor-container-modal ${onSaveCb.id}`;
                    document.body.appendChild(modalEl);

                    var containerEl = document.createElement('div');
                    containerEl.className = 'cstudio-template-editor-container';
                    YAHOO.util.Dom.addClass(containerEl, 'seethrough');
                    modalEl.appendChild(containerEl);
                    var formHTML = '';

                    if (isRead === 'read') {
                      formHTML += '<div class="cstudio-form-readonly-banner">READ ONLY</div>';
                    }

                    formHTML +=
                      '<div class=\'template-editor-toolbar\'><div class=\'template-editor-toolbar-variable\'></div>' +
                      '<div class=\'\' style=\'position: absolute; right: 20px; bottom: 18px;\'>' +
                      '<select id=\'themeSelector\'>' +
                      '<option value=\'chrome\'>Light Theme</option>' +
                      '<option value=\'tomorrow_night\'>Dark Theme</option>' +
                      '</select>' +
                      '</div>' +
                      '</div>' +
                      '<div class=\'editor-container\'>' +
                      '</div>' +
                      '<div class=\'template-editor-button-container\'>';

                    if (isWrite == true) {
                      formHTML +=
                        '<div class=\'edit-buttons-container\'>' +
                        '<div class=\'template-editor-update-button btn btn-primary cstudio-template-editor-button\'>' +
                        formatMessage(words.update) +
                        '</div>' +
                        '<div class=\'dropup inline-block relative\'>' +
                        '<span data-toggle=\'dropdown\' aria-haspopup=\'true\' aria-expanded=\'false\' class=\'template-editor-cancel-button btn btn-default cstudio-template-editor-button\'>' +
                        formatMessage(words.cancel) +
                        '</span>' +
                        '<ul class=\'dropdown-menu\' aria-labelledby=\'template-editor-cancel-button\'>' +
                        '<li><a class=\'cancel\' href=\'#\' onclick=\'return false;\'>' +
                        formatMessage(messages.stay) +
                        '</a></li>' +
                        '<li role=\'separator\' class=\'divider\'></li>' +
                        '<li><a class=\'confirm\' href=\'#\'>' +
                        formatMessage(messages.confirm) +
                        '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '<div/>';
                    } else {
                      formHTML +=
                        '<div class=\'edit-buttons-container viewer\'>' +
                        '<div style=\'right: 120px;\' class=\'template-editor-cancel-button btn btn-default cstudio-template-editor-button\'>Close</div>';
                      ('<div/>');
                    }

                    formHTML += '</div>';

                    containerEl.innerHTML = formHTML;
                    var editorContainerEl = modalEl.querySelector('.editor-container');
                    var editorEl = document.createElement('pre');
                    editorEl.className = 'editorPreEl';
                    editorEl.textContent = content;
                    editorContainerEl.appendChild(editorEl);

                    // dispatch legacyTemplateEditor.opened
                    var event = new CustomEvent('legacyTemplateEditor.opened');
                    document.dispatchEvent(event);

                    var langTools;

                    var initEditorFn = function () {
                      if (typeof ace === 'undefined') {
                        window.setTimeout(500, initEditorFn);
                      } else {
                        var modePath = 'ace/mode/';
                        var mode = modePath + 'htmlmixed';

                        if (templatePath.indexOf('.css') != -1) {
                          mode = modePath + 'css';
                        } else if (templatePath.indexOf('.js') != -1) {
                          mode = modePath + 'javascript';
                        } else if (templatePath.indexOf('.groovy') != -1) {
                          mode = modePath + 'groovy';
                        } else if (templatePath.indexOf('.ftl') != -1) {
                          mode = modePath + 'ftl';
                        } else if (templatePath.indexOf('.xml') != -1) {
                          mode = modePath + 'xml';
                        }

                        langTools = ace.require('ace/ext/language_tools');
                        var aceEditor = ace.edit(modalEl.querySelector('.editorPreEl')),
                          defaultTheme =
                            CStudioForms.TemplateEditor.config &&
                            CStudioForms.TemplateEditor.config.getElementsByTagName('theme')[0] &&
                            CStudioForms.TemplateEditor.config.getElementsByTagName('theme')[0].textContent === 'dark'
                              ? 'tomorrow_night'
                              : 'chrome',
                          theme = localStorage.getItem('templateEditorTheme')
                            ? localStorage.getItem('templateEditorTheme')
                            : defaultTheme,
                          enableBasicAutocompletion =
                            CStudioForms.TemplateEditor.config &&
                            CStudioForms.TemplateEditor.config.getElementsByTagName('enable-basic-autocompletion')[0]
                              ? CStudioForms.TemplateEditor.config.getElementsByTagName(
                              'enable-basic-autocompletion'
                            )[0].textContent === 'true'
                              : true,
                          enableLiveAutocompletion =
                            CStudioForms.TemplateEditor.config &&
                            CStudioForms.TemplateEditor.config.getElementsByTagName('enable-live-autocompletion')[0]
                              ? CStudioForms.TemplateEditor.config.getElementsByTagName('enable-live-autocompletion')[0]
                              .textContent === 'true'
                              : true,
                          fontSize =
                            CStudioForms.TemplateEditor.config &&
                            CStudioForms.TemplateEditor.config.getElementsByTagName('font-size')[0]
                              ? CStudioForms.TemplateEditor.config.getElementsByTagName('font-size')[0].textContent
                              : '11pt',
                          tabSize =
                            CStudioForms.TemplateEditor.config &&
                            CStudioForms.TemplateEditor.config.getElementsByTagName('tab-size')[0]
                              ? CStudioForms.TemplateEditor.config.getElementsByTagName('tab-size')[0].textContent
                              : '4';
                        aceEditor.setTheme('ace/theme/' + theme);
                        aceEditor.session.setMode(mode);

                        aceEditor.setOptions({
                          enableBasicAutocompletion: enableBasicAutocompletion,
                          enableLiveAutocompletion: enableLiveAutocompletion,
                          enableSnippets: true,
                          showPrintMargin: false,
                          fontSize: fontSize,
                          tabSize: tabSize
                        });

                        $(modalEl)
                          .find('#themeSelector')
                          .val(theme);

                        $(modalEl)
                          .find('#themeSelector')
                          .on('change', function () {
                            aceEditor.setTheme('ace/theme/' + this.value);
                            localStorage.setItem('templateEditorTheme', this.value);
                          });

                        aceEditor.getSession().on('change', function () {
                          aceEditor.isModified = true;
                          onSaveCb.pendingChanges && onSaveCb.pendingChanges();
                        });

                        return aceEditor;
                      }
                    };

                    var aceEditor = initEditorFn();

                    var _getVarsFromSections = function (sections, parent, variables) {
                      var variables = variables ? variables : [],
                        _searchFields = function (section) {
                          if (section.fields.field.length) {
                            $.each(section.fields.field, function () {
                              if (this.id) {
                                var value = this.title ? this.title : this.id,
                                  containsDash = this.id.indexOf('-') > -1,
                                  id = containsDash ? '["' + this.id + '"]' : this.id;

                                if (parent) {
                                  var parentVarContainsDash = sections.id.indexOf('-') > -1,
                                    parentId = parentVarContainsDash ? '["' + sections.id + '"]' : sections.id;
                                  value = parent + ' - ' + value;
                                  id = containsDash ? parentId + '.item[0]' + id : parentId + '.item[0].' + id;
                                }

                                if (this.type == 'node-selector') {
                                  variables.push(
                                    {
                                      value: id + '.item[0].key',
                                      label: value + ' - Key'
                                    },
                                    {
                                      value: +id + '.item[0].value',
                                      label: value + ' - Value'
                                    }
                                  );
                                } else {
                                  variables.push({
                                    value: id,
                                    label: value
                                  });
                                  if (this.type == 'repeat') {
                                    _getVarsFromSections(this, value, variables);
                                  }
                                }
                              }
                            });
                          } else {
                            var field = section.fields.field;
                            if (field.id) {
                              var value = field.title ? field.title : field.id,
                                containsDash = field.id.indexOf('-') > -1,
                                id = containsDash ? '["' + field.id + '"]' : field.id;

                              if (parent) {
                                var parentVarContainsDash = sections.id.indexOf('-') > -1,
                                  parentId = parentVarContainsDash ? '["' + sections.id + '"]' : sections.id;
                                value = parent + ' - ' + value;
                                id = containsDash ? parentId + '.item[0]' + id : parentId + '.item[0].' + id;
                              }

                              if (field.type == 'node-selector') {
                                variables.push(
                                  {
                                    value: id + '.item[0].key',
                                    label: value + ' - Key'
                                  },
                                  {
                                    value: id + '.item[0].value',
                                    label: value + ' - Value'
                                  }
                                );
                              } else {
                                variables.push({
                                  value: id,
                                  label: value
                                });
                                if (field.type == 'repeat') {
                                  _getVarsFromSections(field, value, variables);
                                }
                              }
                            }
                          }
                        };

                      if (sections.length) {
                        $.each(sections, function () {
                          //puede haber solo una seccion
                          _searchFields(this);
                        });
                      } else {
                        _searchFields(sections);
                      }

                      return variables;
                    };
                    var _addVarsSelect = function () {
                      var selectVarList = document.createElement('select');
                      selectVarList.className = 'varNames';
                      selectVarList.style.marginLeft = '10px';
                      $(modalEl)
                        .find('.variable')
                        .after(selectVarList);
                      $(selectVarList).hide();

                      //fill variables on select item
                      var sectionsCallBack = {
                        success: function (response) {
                          var variables = _getVarsFromSections(response.sections.section);

                          for (var i = 0; i < variables.length; i++) {
                            var option = document.createElement('option');
                            option.value = variables[i].value;
                            option.text = variables[i].label;
                            selectVarList.appendChild(option);
                          }
                        },
                        failure: function () {
                        }
                      };

                      var path = '/content-types' + contentType + '/form-definition.xml';
                      CStudioAuthoring.Service.lookupConfigurtion(CStudioAuthoringContext.site, path, sectionsCallBack);
                    };

                    var templateEditorToolbarVarElt = modalEl.querySelector('.template-editor-toolbar-variable');
                    var filename = templatePath.substring(templatePath.lastIndexOf('/') + 1);
                    var filenameElement = document.createElement('p');
                    filenameElement.className = 'fileName';
                    filenameElement.innerHTML = filename;
                    const nameWrapper = document.createElement('div');
                    nameWrapper.className = 'nameWrapper';
                    nameWrapper.appendChild(filenameElement);
                    templateEditorToolbarVarElt.appendChild(nameWrapper);

                    if (templatePath.indexOf('.ftl') != -1 || templatePath.indexOf('.groovy')) {
                      //Create array of options to be added
                      var variableOpts = {};

                      if (templatePath.indexOf('.groovy') != -1) {
                        //Create array of options to be added
                        variableOpts = codeSnippets.groovy;

                        langTools = ace.require('ace/ext/language_tools');
                        var customCompleter = {
                          getCompletions: function (editor, session, pos, prefix, callback) {
                            callback(
                              null,
                              Object.keys(variableOpts).map(function (key, index) {
                                return {
                                  caption: variableOpts[key].label,
                                  value: variableOpts[key].value,
                                  meta: 'Crafter Studio'
                                };
                              })
                            );
                          }
                        };
                        langTools.addCompleter(customCompleter);
                      } else if (templatePath.indexOf('.ftl') != -1) {

                        me.addLocales(nameWrapper, aceEditor, templatePath, filename, content);

                        variableOpts = codeSnippets.freemarker;

                        langTools = ace.require('ace/ext/language_tools');
                        var customCompleter = {
                          getCompletions: function (editor, session, pos, prefix, callback) {
                            callback(
                              null,
                              Object.keys(variableOpts).map(function (key, index) {
                                return {
                                  caption: variableOpts[key].label,
                                  value: variableOpts[key].value,
                                  meta: 'Crafter Studio'
                                };
                              })
                            );
                          }
                        };
                        langTools.addCompleter(customCompleter);
                      }

                      //Create and append select list
                      if (Object.entries(variableOpts).length > 0) {
                        var variableLabel = document.createElement('label');
                        variableLabel.innerHTML = CMgs.format(contextNavLangBundle, 'variableLabel');

                        var selectList = document.createElement('select');
                        selectList.className = 'variable';
                        templateEditorToolbarVarElt.appendChild(selectList);

                        Object.keys(variableOpts).map(function (key) {
                          let option = document.createElement('option');
                          option.value = key;
                          option.text = variableOpts[key].label;
                          selectList.appendChild(option);
                        });

                        //Create and append add button
                        var addButton = document.createElement('button');
                        addButton.className = 'addButtonVar btn btn-primary';
                        addButton.innerHTML = formatMessage(messages.insert);
                        templateEditorToolbarVarElt.appendChild(addButton);

                        if (contentType && contentType !== '') {
                          _addVarsSelect();

                          var selectedLabel = $(modalEl)
                            .find('.variable')
                            .find('option:selected')
                            .text(),
                            $varsSelect = $(modalEl).find('.varNames');
                          if (selectedLabel == 'Content variable') {
                            $varsSelect.show();
                          }

                          selectList.onchange = function () {
                            var selectedLabel = $(this)
                              .find('option:selected')
                              .text();

                            if (selectedLabel == 'Content variable') {
                              if ($varsSelect.length) {
                                $varsSelect.show();
                              }
                            } else {
                              $varsSelect.hide();
                            }
                          };
                        }

                        addButton.onclick = () => {
                          const cursorPosition = aceEditor.getCursorPosition(),
                            itemKey = selectList.options[selectList.selectedIndex].value,
                            $varDropdown = $(modalEl).find('.varNames');

                          let snippet = variableOpts[itemKey].value;

                          if ($varDropdown.length > 0) {
                            const variable = $varDropdown.val();

                            if (variable.includes('-')) {
                              snippet = snippet.replace('.VARIABLENAME', variable);
                            } else {
                              snippet = snippet.replace('VARIABLENAME', variable);
                            }
                          }

                          // Insert snippet (second argument) in given position
                          aceEditor.session.insert(cursorPosition, snippet);
                          aceEditor.focus();
                        };
                      }
                    }

                    var cancelEdit = function () {
                      var cancelEditServiceUrl =
                        '/api/1/services/api/1/content/unlock-content.json' +
                        '?site=' +
                        CStudioAuthoringContext.site +
                        '&path=' +
                        encodeURI(templatePath);

                      var cancelEditCb = {
                        success: function (response) {
                          // dispatch legacyTemplateEditor.opened
                          var event = new CustomEvent('legacyTemplateEditor.closed');
                          document.dispatchEvent(event);
                          modalEl.parentNode.removeChild(modalEl);
                        },
                        failure: function () {
                        }
                      };

                      if (typeof CStudioAuthoring.editDisabled !== 'undefined') {
                        for (var x = 0; x < window.parent.CStudioAuthoring.editDisabled.length; x++) {
                          window.parent.CStudioAuthoring.editDisabled[x].style.pointerEvents = '';
                        }
                        window.parent.CStudioAuthoring.editDisabled = [];
                      }

                      YAHOO.util.Connect.asyncRequest(
                        'GET',
                        CStudioAuthoring.Service.createServiceUri(cancelEditServiceUrl),
                        cancelEditCb
                      );
                    };

                    $(modalEl)
                      .find('.template-editor-cancel-button')
                      .on('click', function (e) {
                        if (!aceEditor.isModified) {
                          e.stopPropagation();
                          cancelEdit();
                          if (onSaveCb.cancelled) {
                            onSaveCb.cancelled();
                          }
                        }
                      });

                    $(modalEl)
                      .find('.template-editor-cancel-button + .dropdown-menu .confirm')
                      .on('click', function (e) {
                        e.preventDefault();
                        cancelEdit();
                        if (onSaveCb.cancelled) {
                          onSaveCb.cancelled();
                        }
                      });

                    if (isWrite == true) {
                      var saveEl = modalEl.querySelector('.template-editor-update-button');
                      saveEl.onclick = function () {
                        var value = aceEditor.getValue();
                        var path = templatePath.substring(0, templatePath.lastIndexOf('/'));
                        var filename = templatePath.substring(templatePath.lastIndexOf('/') + 1);

                        if (filename.indexOf('.ftl') != -1) {
                          const $select = $('#locale-selector');
                          const baseName = $select.data('baseName');
                          const localeCode = $select.val();
                          filename = localeCode ? `${baseName}_${localeCode}.ftl` : `${baseName}.ftl`;
                        }

                        var writeServiceUrl =
                          '/api/1/services/api/1/content/write-content.json' +
                          '?site=' +
                          CStudioAuthoringContext.site +
                          '&phase=onSave' +
                          '&path=' +
                          path +
                          '&fileName=' +
                          encodeURI(filename) +
                          '&user=' +
                          CStudioAuthoringContext.user +
                          '&unlock=true';

                        fetch(CStudioAuthoring.Service.createServiceUri(writeServiceUrl), {
                          method: 'POST',
                          credentials: 'same-origin',
                          headers: {
                            'Content-Type': `text/plain; charset=utf-8`,
                            [CStudioAuthoringContext.xsrfHeaderName]: CrafterCMSNext.util.auth.getRequestForgeryToken()
                          },
                          body: value
                        })
                          .then((res) => res.json())
                          .then((data) => {
                            if (data && data.result && data.result.success) {
                              var event = new CustomEvent('legacyTemplateEditor.closed');
                              document.dispatchEvent(event);
                              modalEl.parentNode.removeChild(modalEl);
                              onSaveCb.success && onSaveCb.success();
                            }
                          });
                      };
                    }
                    if (onSaveCb.renderComplete) {
                      onSaveCb.renderComplete();
                    }
                  },
                  failure: function () {
                    if (onSaveCb.failure) {
                      onSaveCb.failure();
                    }
                  }
                };

                CStudioAuthoring.Service.getUserPermissions(CStudioAuthoringContext.site, templatePath, permsCallback);
              },

              addLocales: (headerEl, aceEditor, templatePath, filename, defaultContent) => {
                CrafterCMSNext.services.translation.getSiteLocales(CStudioAuthoringContext.site).subscribe(
                  ({ localeCodes }) => {
                    const $select = $('<select id="locale-selector" class="template-editor-locales-selector"></select>');
                    const options = [];
                    let defaultLocale = '';


                    localeCodes.forEach(locale => {
                      const stem = locale.match(/[^_]*/)[0];
                      if (!options.includes(stem)) {
                        options.push(stem);
                      }
                      options.push(locale);
                    });

                    $select.append(`<option value="">${formatMessage(messages.base)}</option>`);

                    //get the baseName
                    $select.data('baseName', filename.replace('.ftl', ''));

                    options.forEach(locale => {
                      if (filename.replace('.ftl', '').endsWith(locale)) {
                        $select.data('baseName', filename.replace(`_${locale}.ftl`, ''));
                        defaultLocale = locale;
                      }
                      $select.append(`<option value="${locale}">${locale}</option>`);
                    });
                    $select.val(defaultLocale);


                    $(headerEl).append($select);

                    //set prev value
                    $select.data('prev', $select.val());

                    $select.on('change', function () {
                      const path = templatePath.substring(0, templatePath.lastIndexOf('/'));
                      let localePath = templatePath;

                      if (this.value) {
                        const baseName = $select.data('baseName');
                        localePath = `${path}/${baseName}_${this.value}.ftl`;
                      }

                      CStudioAuthoring.Service.getContent(localePath, true, {
                        success: (content) => {
                          const baseName = $select.data('baseName');
                          if (content) {
                            //updating the filename
                            $(headerEl).find('.fileName')[0].innerText = this.value ? `${baseName}_${this.value}.ftl` : `${baseName}.ftl`;

                            //set prev value
                            $select.data('prev', $select.val());

                            aceEditor.setValue(content, -1);
                          } else {
                            const createTemplateOnOk = 'createTemplateOnOk';
                            const createTemplateOnCancel = 'createTemplateOnCancel';

                            CrafterCMSNext.system.store.dispatch({
                              type: 'SHOW_CONFIRM_DIALOG',
                              payload: {
                                open: true,
                                title: formatMessage(messages.localesConfirmTitle),
                                body: formatMessage(messages.localesConfirmBody),
                                onOk: {
                                  type: 'DISPATCH_DOM_EVENT',
                                  payload: { id: createTemplateOnOk }
                                },
                                onCancel: {
                                  type: 'DISPATCH_DOM_EVENT',
                                  payload: { id: createTemplateOnCancel }
                                }
                              }
                            });

                            CrafterCMSNext.createLegacyCallbackListener(createTemplateOnOk, () => {
                              //updating the filename
                              $(headerEl).find('.fileName')[0].innerText = this.value ? `${baseName}_${this.value}.ftl` : `${baseName}.ftl`;
                              aceEditor.setValue(defaultContent);
                              CrafterCMSNext.system.store.dispatch({ type: 'CLOSE_CONFIRM_DIALOG' });
                            });

                            CrafterCMSNext.createLegacyCallbackListener(createTemplateOnCancel, () => {
                              $select.val($select.data('prev'));
                              CrafterCMSNext.system.store.dispatch({ type: 'CLOSE_CONFIRM_DIALOG' });
                            });

                          }
                        }
                      });
                    });
                  }
                );
              }
            };

            CStudioAuthoring.Module.moduleLoaded('cstudio-forms-template-editor', CStudioForms.TemplateEditor);
          }
        }
      );
    }
  }
);
