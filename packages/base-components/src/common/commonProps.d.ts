
// 由于vue目前无法导入typescript 需要等待3.3解决 https://github.com/vuejs/core/issues/4294

export interface CommonProps {
    // 是否正在编辑中 用于区分一些场景 默认false
    isEdit: boolean;
    // 组件的唯一id
    cid: string | number;
}