export default {
  // 空数据
  name: "cl-empty",
  props: {
    buttonTitle: {
      type: String,
      default: "新建",
    },
    emptyText: {
      type: String,
      default: "暂无数据",
    },
    buttonIcon: {
      type: String,
      default: "el-icon-plus",
    },
    showButton: Boolean,
    buttonType: {
      type: String,
      default: "primary",
    },

    auto: {
      type: Boolean,
      default: true,
    },
  },
  inject: {
    crud: {
      default: "",
    },
  },

  data() {
    return {};
  },
  methods: {
    btnClick() {
      if (this.auto && this.crud && this.crud.rowAdd) {
        this.crud.rowAdd();
      }

      this.$emit("click");
    },
  },

  render() {
    const buttonProp = Object.assign(
      {},
      {
        icon: this.buttonIcon,
        type: this.buttonType,
      },
      this.$attrs
    );
    return (
      <div class="cl-empty">
        <div class="cl-empty__title">{this.$slots.default || this.emptyText || "暂无数据"}</div>
        {this.showButton && (
          <el-button
            {...{ attrs: buttonProp }}
            class="cl-empty__button"
            onclick={this.btnClick}
          >
            {this.buttonTitle || "新建"}
          </el-button>
        )}
      </div>
    );
  },
};
