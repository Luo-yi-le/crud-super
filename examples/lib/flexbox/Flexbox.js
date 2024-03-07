export default {
  name: "cl-flex-box",
  props: {
    gutter: {
      type: Number,
      default: 8,
    },
    orient: {
      type: String,
      default: "horizontal",
    },
    justify: String,
    align: String,
    wrap: String,
    direction: String,
  },
  computed: {
    styles() {
      const styles = {
        "justify-content": this.justify,
        "-webkit-justify-content": this.justify,
        "align-items": this.align,
        "-webkit-align-items": this.align,
        "flex-wrap": this.wrap,
        "-webkit-flex-wrap": this.wrap,
        "flex-direction": this.direction,
        "-webkit-flex-direction": this.direction,
      };
      return styles;
    },
  },

  render() {
    const _class = ["cl-flexbox"];
    this.orient === "vertical" && _class.push("cl-flex-col");
    this.orient === "horizontal" && _class.push("cl-flex-row");
    return (
      <div class={_class} style={this.styles}>
        {this.$slots.default}
      </div>
    );
  },
};
