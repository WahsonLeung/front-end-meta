class H2Grid extends Polymer.mixinBehaviors([BaseBehavior], Polymer.Element) {
  constructor() {
    super();
  }

  static get is() {
    return "h2-grid";
  }

  getMeta(actions, actionId) {
    return this.getValueByKey(actions, actionId).formMeta;
  }

  static get properties() {
    return {
      editable: {
        type: Boolean,
        value: false
      },
      models: {
        type: Array,
        observable: true
      },
      metadata: {
        type: Object,
        observable: true
      }
    };
  }

  ready() {
    super.ready();
    this.async(this.render.bind(this), 1000);
  }

  render() {
    ReactDOM.render(React.createElement(
      "table",
      { width: "100%" },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          this.metadata.grids.map((item, ind) => React.createElement(
            "td",
            { key: ind },
            item.label
          ))
        )
      ),
      React.createElement(
        "tbody",
        null,
        this.models.map((model, trInd) => {
          const tds = this.metadata.grids.map((fieldMeta, tdInd) => {
            if (fieldMeta.datatype !== 'action') {
              if (this.editable) {
                const TagName = fieldMeta.element || H2Grid.defaultElements[fieldMeta.datatype];

                return React.createElement(
                  "td",
                  { key: tdInd },
                  React.createElement(TagName, {
                    "field-meta": JSON.stringify(fieldMeta),
                    context: JSON.stringify(model),
                    value: JSON.stringify(model[fieldMeta.name]) })
                );
              } else {
                const TagName = "h2-crust";
                return React.createElement(
                  "td",
                  { key: tdInd },
                  React.createElement(TagName, { element: this.elementRender(model, fieldMeta) })
                );
              }
            } else {
              const ac = model.actions.map((actionId, ind) => React.createElement("h2-action", { key: `${trInd}_${tdInd}_${ind}`,
                "action-meta": JSON.stringify(this.getValueByKey(this.metadata.actions, actionId)),
                model: JSON.stringify(model) }));
              return React.createElement(
                "td",
                { key: tdInd },
                ac
              );
            }
          });
          return React.createElement(
            "tr",
            { key: trInd },
            tds
          );
        })
      )
    ), this.$.table);
  }

  static get defaultElements() {
    return {
      'text': 'h2-text',
      'textarea': 'h2-text-area',
      'number': 'h2-number',
      'date': 'h2-date',
      'select-list': 'h2-select-list',
      'select-tree': 'h2-select-tree',
      'radio-group': 'h2-radio-group'
    };
  }
}

customElements.define(H2Grid.is, H2Grid);
