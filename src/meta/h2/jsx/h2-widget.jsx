
class H2Widget extends Polymer.mixinBehaviors([BaseBehavior], H2WidgetBase) {
  static get is() {
    return "h2-widget";
  }

  static get properties() {
    return {
      editable: {
        type: Boolean,
        value: false
      },
      readonlyTemplate: {
        type: String,
        value: 'h2-crust'
      },
      value: {
        type: Object
      }
    };
  }

  static get observers() {
    return [
      '__fieldMetaChange(fieldMeta)',
      '__valueChange(value)'
    ];
  }

  validate() {
    const ele = this.$.slot.firstChild;
    return ele && ele.validate && ele.validate();
  }

  __renderElement(TagName,props) {
    const reactObj = ReactDOM.render(
        <TagName />, this.$.slot);

    return ReactDOM.findDOMNode(reactObj);
  }

  __fieldMetaChange() {
    if (this.editable) {
      const TagName = this.fieldMeta.element || H2Widget.defaultElements[this.fieldMeta.datatype];

      ReactDOM.render(
          <TagName
              field-meta={JSON.stringify(this.fieldMeta)}
              context={JSON.stringify(this.context)}
              value={JSON.stringify(this.context[this.fieldMeta.name])}
              ref={(TagName) => this.value = TagName.value}/> , this.$.slot);

    } else {
      const TagName = this.readonlyTemplate;
      ReactDOM.render(
          <TagName element={this.elementRender(this.context, this.fieldMeta)}/>, this.$.slot);
    }
  }

  __valueChange() {
    // const target = this.$.slot.firstChild;
    // if (target) {
    //   target.value = this.value
    // }
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

customElements.define(H2Widget.is, H2Widget);