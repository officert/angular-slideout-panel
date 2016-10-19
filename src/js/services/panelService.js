angular.module('angular-slideout-panel').service('angularSlideOutPanel', [
  '$q',
  '$rootScope',
  '$timeout',
  '$http',
  '$compile',
  '$controller',
  'angularSlideOutPanelStack',
  'panelResolve',
  ($q, $rootScope, $timeout, $http, $compile, $controller, angularSlideOutPanelStack, panelResolve) => {
    class AngularSlideOutPanel {
      /**
       * @param {Object} [options]
       * @param {String} [options.templateUrl]
       * @param {String} [options.template]
       * @param {String} [options.openOn] - 'left' or 'right' - defaults to 'left'
       */
      open(options) {
        if (!options) throw new Error('angularSlideOutPanel - open() - options is required');
        if (!options.templateUrl && !options.template) throw new Error('angularSlideOutPanel - open() - options.templateUrl or options.template is required');

        options.openOn = (options.openOn && (options.openOn === 'right' || options.openOn === 'left')) ? options.openOn : 'left';

        return _createPanel(options);
      }
    }

    class Panel {
      /**
       * @param {Object} options
       * @param {String} [options.templateUrl]
       * @param {String} [options.template]
       * @param {String} [options.openOn]
       * @param {Object} [options.resolve]
       * @param {String|Function|Array} [options.controller]
       */
      constructor(options) {
        if (!options) throw new Error('Panel - constructor() - options is required');

        this._deferred = $q.defer();
        this.result = this._deferred.promise;

        this.templateUrl = options.templateUrl;
        this.template = options.template;
        this.openOn = options.openOn;
        this.controller = options.controller;
        this.resolve = options.resolve;

        this._elements = _createPanelElements({
          openOn: this.openOn,
          close: this.close.bind(this),
          dismiss: this.dismiss.bind(this)
        });

        _getControllerScope(this.templateUrl, this.template, this.controller, this.resolve)
          .then(scopeAndTemplate => {
            let scope = scopeAndTemplate.scope;
            let template = scopeAndTemplate.template;

            scope.$panelInstance = this; //add the Panel instance to the scope so it can be closed from whatever controller the user provides

            let compiledElement = _createTemplate(scope, template);

            this._elements.modalContentElement.append(compiledElement);

            openModalElements(this._elements.modalElement, this._elements.modalBgElement);
          });
      }

      close(result) {
        closeModalElements(this._elements.modalElement, this._elements.modalBgElement);

        this._deferred.resolve(result);
      }

      dismiss(reason) {
        closeModalElements(this._elements.modalElement, this._elements.modalBgElement);

        this._deferred.reject(reason);
      }
    }

    /**
     * @param {Object} [options]
     * @param {String} [options.openOn] - 'left' or 'right' - defaults to 'left'
     */
    function _createPanel(options) {
      return new Panel(options);
    }

    /**
     * @param {Object} controller
     * @param {Object} resolve - hash of promises to resolve
     */
    function _getControllerScope(templateUrl, template, controller, resolve) {
      let templatePromise = templateUrl ? _getTemplate(templateUrl) : $q.resolve({
        data: template
      });

      let templateAndResolvePromise = $q.all([
        templatePromise,
        panelResolve.resolve(resolve)
      ]);

      return templateAndResolvePromise
        .then(templateAndVars => {
          let locals = {};

          let newScope = $rootScope.$new();

          locals.$scope = newScope;
          locals.$scope.$resolve = {};

          let resolves = templateAndVars[1];
          angular.forEach(resolves, (value, key) => {
            locals[key] = value;

            locals.$scope.$resolve[key] = value;
          });

          let ctrlInstantiate = $controller(controller, locals, true);

          ctrlInstantiate();

          return $q.resolve({
            scope: newScope,
            template: templateAndVars[0] ? templateAndVars[0].data : null
          });
        });
    }

    /**
     * @param {Object} [options]
     * @param {String} [options.openOn] - 'left' or 'right' - defaults to 'left'
     * @param {Function} [options.close] - close the modal and resolve the promise
     * @param {Function} [options.dismiss] - close the modal and reject the promise
     */
    function _createPanelElements(options) {
      options = options || {};

      let modalElement = angular.element(document.createElement('div'));
      modalElement.addClass('angular-panel');

      let modalBgElement = getOrCreateModalBgElement(modalElement, options);

      let modalDialogElement = angular.element(document.createElement('div'));
      modalDialogElement.addClass('angular-panel-dialog');
      modalDialogElement.on('click', (event) => {
        event.stopPropagation(); //prevent a click on the modal from closing it
      });

      let modalContentElement = angular.element(document.createElement('div'));
      modalContentElement.addClass('angular-panel-content');

      // let modalCloseElement = angular.element(document.createElement('div'));
      // modalCloseElement.addClass('angular-panel-close');
      // modalCloseElement.on('click', (event) => { //close the modal on close button click
      //   if (event) event.preventDefault();
      //
      //   if (options.dismiss) options.dismiss('backdrop click');
      // });

      let modalCloseAElement = angular.element(document.createElement('a'));
      modalCloseAElement.attr('href', '#');
      modalCloseAElement.addClass('tl-icon tl-icon-times');

      // modalCloseElement.append(modalCloseAElement);

      modalDialogElement.append(modalContentElement);

      modalBgElement.append(modalDialogElement);

      modalElement.append(modalBgElement);

      let bodyElement = angular.element(document.querySelector('body'));
      if (bodyElement) bodyElement.append(modalElement);

      return {
        modalBgElement,
        modalElement,
        modalContentElement
      };
    }

    /**
     * @param {DOMElement} modalElement
     * @param {Object} [options]
     * @param {String} [options.openOn] - direction to open the panel
     */
    function getOrCreateModalBgElement(modalElement, options) {
      options = options || {};

      let bodyElement = angular.element(document.querySelector('body'));
      let existingModalBgElement = document.querySelector('.angular-panel-bg');

      if (existingModalBgElement) return angular.element(existingModalBgElement);

      let modalBgElement = angular.element(document.createElement('div'));
      modalBgElement.addClass('angular-panel-bg');
      modalBgElement.addClass('angular-panel-open-' + options.openOn);
      modalBgElement.on('click', () => { //close the modal on backgroup clicks
        if (options.dismiss) options.dismiss('backdrop click');
      });

      bodyElement.on('keydown keypress', event => { //close the modal on escape keypress
        if (event.which === 27) { // 27 = esc key
          event.preventDefault();

          if (options.dismiss) options.dismiss('escape key press');
        }
      });

      return modalBgElement;
    }

    function closeModalElements(modalElement, modalBgElement) {
      $timeout(() => {
        modalBgElement.removeClass('open');
      });

      $timeout(() => {
        modalElement.remove();
      }, 200);

      let bodyElement = angular.element(document.querySelector('body'));

      bodyElement.off('keydown keypress');
    }

    function openModalElements(modalElement, modalBgElement) {
      $timeout(() => {
        modalBgElement.addClass('open');
      });
    }

    function _createTemplate(newScope, htmlString) {
      let compiledElement = $compile(htmlString)(newScope);
      return compiledElement;
    }

    function _getTemplate(templateUrl) {
      return $http.get(templateUrl);
    }

    return new AngularSlideOutPanel();
  }
]);
