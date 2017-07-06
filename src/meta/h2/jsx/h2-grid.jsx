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
    }
  }

  ready() {
    super.ready();
    this.async(this.render.bind(this), 1000);

  }

  render() {
    ReactDOM.render(
        <table width="100%">
          <thead>
          <tr>
            {this.metadata.grids.map((item, ind) => <td key={ind}>{item.label}</td>)}
          </tr>
          </thead>
          <tbody>
          {
            this.models.map((model, trInd) => {
              const tds = this.metadata.grids.map((fieldMeta, tdInd) => {
                if (fieldMeta.datatype !== 'action') {
                  if (this.editable) {
                    const TagName = fieldMeta.element || H2Grid.defaultElements[fieldMeta.datatype];

                    return <td key={tdInd}>
                      <TagName
                          field-meta={JSON.stringify(fieldMeta)}
                          context={JSON.stringify(model)}
                          value={JSON.stringify(model[fieldMeta.name])}/>
                    </td>

                  } else {
                    const TagName = "h2-crust";
                    return <td key={tdInd}>
                      <TagName element={this.elementRender(model, fieldMeta)}/>
                    </td>
                  }
                } else {
                  const ac = model.actions.map((actionId, ind) =>
                      <h2-action key={`${trInd}_${tdInd}_${ind}`}
                                 action-meta={JSON.stringify(this.getValueByKey(this.metadata.actions, actionId))}
                                 model={JSON.stringify(model)}>
                      </h2-action>
                  );
                  return <td key={tdInd}>{ac}</td>
                }
              });
              return <tr key={trInd}>{tds}</tr>
            })
          }
          </tbody>
        </table>, this.$.table);
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