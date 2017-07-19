class H2Grid extends Polymer.mixinBehaviors([BaseBehavior], Polymer.Element) {
  constructor() {
    super();
  }

  static get is() {
    return "h2-grid";
  }

  static get properties() {
    return {
      editable: {
        type: Boolean,
        value: false
      },
      models: {
        type: Array,
      },
      metadata: {
        type: Object,
      }
    }
  }

  static get observers() {
    return [
      '_modelsChange(models, metadata)'
    ];
  }

  _modelsChange() {
    this.models && this.metadata && this.render();
  }

  render() {
    ReactDOM.render(
        <table width="100%">
          <caption className="table-caption">{this.metadata.title}</caption>
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
                  let actionCount = 0;
                  const noGroupAcs = this.noGroupActions(model.actions).map((actionMeta, ind) =>
                      <h2-action key={`${trInd}_${tdInd}_${actionCount++}`}
                                 class="action"
                                 metadata={JSON.stringify(actionMeta)}
                                 model={JSON.stringify(model)}>
                      </h2-action>
                  );

                  const groupedAcs = this.groupedActions(model.actions).map((grp, ind) =>
                      <h2-action-group
                          key={`${trInd}_${tdInd}_${actionCount++}`}
                          class="action-group"
                          name={grp.group}>
                        {grp.actions.map((actionMeta, listInd) =>
                            <h2-action key={`${trInd}_${tdInd}_${actionCount}_${listInd}`}
                                       metadata={JSON.stringify(actionMeta)}
                                       model={JSON.stringify(model)}>
                            </h2-action>
                        )}
                      </h2-action-group>
                  );

                  return <td key={tdInd}>{noGroupAcs}{groupedAcs}</td>
                }
              });
              return <tr key={trInd}>{tds}</tr>
            })
          }
          </tbody>
        </table>, this.$.table);
  }

  groupedActions(actions) {
    const groupedActions = [];
    const groupMap = {};
    actions.map(actionId => {
      const meta = this.getValueByKey(this.metadata.actions, actionId);
      const grp = meta.group;
      if (grp) {
        groupMap[grp] = groupMap[grp] || [];
        groupMap[grp].push(meta);
      }
    });
    for (let grp in groupMap) {
      groupedActions.push({group: grp, actions: groupMap[grp]});
    }
    return groupedActions;
  }

  noGroupActions(actions) {
    return actions.filter(actionId => {
      const meta = this.getValueByKey(this.metadata.actions, actionId);
      const grp = meta.group;
      return !grp;
    }).map(actionId => this.getValueByKey(this.metadata.actions, actionId));
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