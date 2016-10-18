angular.module('angular-slideout-panel').service('angularSlideOutPanelStack', [
  () => {
    class AngularPanelStack {
      constructor() {
        this._stack = [];
      }

      _addPanel(panel) {
        if (!panel) return;

        this._stack.push(panel);
      }
    }

    return new AngularPanelStack();
  }
]);
