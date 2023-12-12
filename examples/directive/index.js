import { __getters, __store } from './../options';
function onPass(el, binding) {
    const dlg = el.querySelector('.el-dialog');
    const { dialog, props } = binding.value;
    const { clientHeight } = document.body;

    if (dialog.fullscreen) {
        return false;
    }

    if (!props.drag) {
        return false;
    }

    // 超出禁用拖动
    let top = 0;

    if (['vh', '%'].some(e => props.marginTop.includes(e))) {
        top = clientHeight * (parseInt(props.marginTop) / 100);
    }

    if (props.marginTop.includes('px')) {
        top = props.marginTop;
    }

    if (dlg.clientHeight > clientHeight - 50 - top) {
        return false;
    }

    return true;
}

export const DialogDrag = {
    bind(el, binding) {
        const dlg = el.querySelector('.el-dialog');
        if (!dlg) return false;
        const hdr = el.querySelector('.el-dialog__header');
        if (!hdr) return false;
        const sty = dlg.currentStyle || window.getComputedStyle(dlg, null);
        const pad = 5;
        const { props, dialog } = binding.value;

        if (!props.marginTop) {
            props.marginTop = '15vh';
        }

        dlg.style.marginTop = 0;
        dlg.style.top = props.fullscreen ? 0 : props.marginTop;

        const moveDown = e => {
            const { clientWidth, clientHeight } = document.body;
            const isDrag = onPass(el, binding);

            if (isDrag) {
                dlg.style.marginBottom = 0;
                hdr.style.cursor = 'move';
            } else {
                hdr.style.cursor = 'text';
                return (dlg.style.marginBottom = dialog.fullscreen ? 0 : '50px');
            }

            const disX = e.clientX - hdr.offsetLeft;
            const disY = e.clientY - hdr.offsetTop;

            let styL, styT;

            if (sty.left.includes('%')) {
                styL = +clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                styT = +clientHeight * (+sty.top.replace(/\%/g, '') / 100);
            } else {
                styL = +sty.left.replace(/\px/g, '');
                styT = +sty.top.replace(/\px/g, '');
            }

            const minL = -(clientWidth - dlg.clientWidth) / 2 + pad;
            const maxL =
                (dlg.clientWidth >= clientWidth / 2
                    ? dlg.clientWidth / 2 - (dlg.clientWidth - clientWidth / 2)
                    : dlg.clientWidth / 2 + clientWidth / 2 - dlg.clientWidth) - pad;

            const minT = pad;
            const maxT = clientHeight - dlg.clientHeight - pad;

            document.onmousemove = function (e) {
                let l = e.clientX - disX + styL;
                let t = e.clientY - disY + styT;

                if (l < minL) {
                    l = minL;
                } else if (l >= maxL) {
                    l = maxL;
                }

                if (t < minT) {
                    t = minT;
                } else if (t >= maxT) {
                    t = maxT;
                }

                dlg.style.top = t + 'px';
                dlg.style.left = l + 'px';
            };

            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        hdr.onmousedown = moveDown;
    }
};


/**
* v-hasRole 角色权限处理
* Copyright (c) 2019
*/
export const hasRole = {
    inserted(el, binding, vnode) {
        const { $store } = vnode.context
        const { value } = binding
        const super_admin = "admin";
        const roles = (__store.getters && __store.getters.roles) || ($store.getters && $store.getters.roles)
        if (value && value instanceof Array && value.length > 0) {
            const roleFlag = value

            const hasRole = roles.some(role => {
                return super_admin === role || roleFlag.includes(role)
            })

            if (!hasRole) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`请设置角色权限标签值"`)
        }
    }
}


export const hasPermi = {
    inserted(el, binding, vnode) {
        const { $store } = vnode.context
        const { value } = binding
        const all_permission = "*:*:*";
        const permissions = (__getters.permission && __getters.permission.length) ? __getters.permission : ((__store.getters && __store.getters.permissions) || ($store.getters && $store.getters.permissions))
        if (value && value instanceof Array && value.length > 0) {
            const permissionFlag = value

            const hasPermissions = permissions.some(permission => {
                return all_permission === permission || permissionFlag.includes(permission)
            })

            if (!hasPermissions) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`请设置操作权限标签值`)
        }
    }
}

export const contextmenu = (contextMenu) => {
    const fn = (el, binding, vnode) => {
        const { $store } = vnode.context
        const { value } = binding
        // console.log(binding, this)
        el.oncontextmenu = function (e) {
            contextMenu.open(e, {
                list: value || []
            }, $store || __store);
        };
    }

    return {
        inserted: fn,
        update: fn,
    }

}