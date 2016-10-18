angular.module('angular-slideout-panel').service('angularSlideOutPanel', [
  '$q',
  '$rootScope',
  '$timeout',
  '$http',
  '$compile',
  ($q, $rootScope, $timeout, $http, $compile) => {
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

        //TODO: handle errors getting templates,
        //TODO: return promise with PanelInstance object

        let templatePromise = options.templateUrl ? _getTemplate(options.templateUrl) : $q.resolve(options.template);

        templatePromise
          .then(template => {
            _createPanel(template, options);
          });
      }
    }

    /**
     * @param {Object} [options]
     * @param {String} [options.openOn] - 'left' or 'right' - defaults to 'left'
     */
    function _createPanel(template, options) {
      let elements = _createPanelElements(options);

      let newScope = _getControllerScope(options.controller);

      // let panelOptions = {};
      //
      // //add a closeModal function to the directive's scope so the modal can be programatically closed by the directive's code
      // panelOptions.closeModal = function() {
      //   elements.modalElement.remove();
      // };

      let compiledElement = _createTemplate(newScope, template);

      elements.modalContentElement.append(compiledElement);

      openModalElements(elements.modalElement, elements.modalBgElement);
    }

    function _getControllerScope(controller) {
      //TODO: if it's string then instantiate the controller, otherwise we should have a controller instance, back up to the $rootScope

      return $rootScope.$new();
    }

    /**
     * @param {Object} [options]
     * @param {String} [options.openOn] - 'left' or 'right' - defaults to 'left'
     */
    function _createPanelElements(options) {
      options = options || {};

      let modalElement = angular.element(document.createElement('div'));
      modalElement.addClass('angular-panel');

      let modalBgElement = angular.element(document.createElement('div'));
      modalBgElement.addClass('angular-panel-bg');
      modalBgElement.addClass('angular-panel-open-' + options.openOn);
      modalBgElement.on('click', () => { //close the modal on backgroup clicks
        closeModalElements(modalElement, modalBgElement);
      });

      let modalDialogElement = angular.element(document.createElement('div'));
      modalDialogElement.addClass('angular-panel-dialog');
      modalDialogElement.on('click', (event) => {
        event.stopPropagation(); //prevent a click on the modal from closing it
      });

      let modalContentElement = angular.element(document.createElement('div'));
      modalContentElement.addClass('angular-panel-content');

      let modalCloseElement = angular.element(document.createElement('div'));
      modalCloseElement.addClass('angular-panel-close');
      modalCloseElement.on('click', (event) => { //close the modal on close button click
        if (event) event.preventDefault();

        closeModalElements(modalElement, modalBgElement);
      });

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

    function closeModalElements(modalElement, modalBgElement) {
      $timeout(() => {
        modalBgElement.addClass('close');
      });

      $timeout(() => {
        modalElement.remove();
      }, 200);
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
