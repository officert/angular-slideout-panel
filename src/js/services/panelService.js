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
    const PANEL_ELEMENT_CLASSES = {
      PANEL_BG_ELEMENT: 'angular-panel-bg',
      PANEL_BG_ELEMENT_OPEN: 'angular-panel-open-',
      PANEL_DIALOG_ELEMENT: 'angular-panel-dialog',
      PANEL_CONTENT_ELEMENT: 'angular-panel-content'
    };

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

        this._getControllerScope()
          .then(scopeAndTemplate => {
            let scope = scopeAndTemplate.scope;
            let template = scopeAndTemplate.template;

            scope.$panelInstance = this; //add the Panel instance to the scope so it can be closed from whatever controller the user provides

            let compiledElement = _createTemplate(scope, template);

            this._elements.modalContentElement.append(compiledElement);

            openModalElements(this._elements.modalBgElement);
          });
      }

      /**
       * @param {Object} controller
       * @param {Object} resolve - hash of promises to resolve
       * @private
       */
      _getControllerScope() {
        let templatePromise = this.templateUrl ? _getTemplate(this.templateUrl) : $q.resolve({
          data: this.template
        });

        let templateAndResolvePromise = $q.all([
          templatePromise,
          panelResolve.resolve(this.resolve)
        ]);

        return templateAndResolvePromise
          .then(templateAndVars => {
            let locals = {};

            let newScope = $rootScope.$new();

            locals.$scope = newScope;
            locals.$scope.$resolve = {};
            locals.$panelInstance = this;

            let resolves = templateAndVars[1];
            angular.forEach(resolves, (value, key) => {
              locals[key] = value;

              locals.$scope.$resolve[key] = value;
            });

            let ctrlInstantiate = $controller(this.controller, locals, true);

            ctrlInstantiate();

            return $q.resolve({
              scope: newScope,
              template: templateAndVars[0] ? templateAndVars[0].data : null
            });
          });
      }

      close(result) {
        closeModalElements(this._elements.modalBgElement);

        this._deferred.resolve(result);
      }

      dismiss(reason) {
        closeModalElements(this._elements.modalBgElement);

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
     * @param {Object} [options]
     * @param {String} [options.openOn] - 'left' or 'right' - defaults to 'left'
     * @param {Function} [options.close] - close the modal and resolve the promise
     * @param {Function} [options.dismiss] - close the modal and reject the promise
     */
    function _createPanelElements(options) {
      options = options || {};

      let modalBgElement = getOrCreateModalBgElement(options);

      let modalDialogElement = angular.element(document.createElement('div'));
      modalDialogElement.addClass(PANEL_ELEMENT_CLASSES.PANEL_DIALOG_ELEMENT);
      modalDialogElement.on('click', (event) => {
        event.stopPropagation(); //prevent a click on the modal from closing it
      });

      let modalContentElement = angular.element(document.createElement('div'));
      modalContentElement.addClass(PANEL_ELEMENT_CLASSES.PANEL_CONTENT_ELEMENT);

      let modalCloseAElement = angular.element(document.createElement('a'));
      modalCloseAElement.attr('href', '#');
      modalCloseAElement.addClass('tl-icon tl-icon-times');

      // modalCloseElement.append(modalCloseAElement);

      modalDialogElement.append(modalContentElement);

      modalBgElement.append(modalDialogElement);

      let bodyElement = angular.element(document.querySelector('body'));
      if (bodyElement) bodyElement.append(modalBgElement);

      return {
        modalBgElement,
        modalContentElement
      };
    }

    /**
     * @param {Object} [options]
     * @param {String} [options.openOn] - direction to open the panel
     */
    function getOrCreateModalBgElement(options) {
      options = options || {};

      let bodyElement = angular.element(document.querySelector('body'));

      let modalBgElement = angular.element(document.createElement('div'));

      modalBgElement.addClass(PANEL_ELEMENT_CLASSES.PANEL_BG_ELEMENT);
      modalBgElement.addClass(PANEL_ELEMENT_CLASSES.PANEL_BG_ELEMENT_OPEN + options.openOn);
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

    function closeModalElements(modalBgElement) {
      $timeout(() => {
        modalBgElement.removeClass('open');

        $timeout(() => {
          modalBgElement.remove();
        }, 600);
      });

      let bodyElement = angular.element(document.querySelector('body'));

      bodyElement.off('keydown keypress');
    }

    function openModalElements(modalBgElement) {
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
