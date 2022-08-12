<script lang="ts">
import Draggable from 'vuedraggable'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue'
import type { ComponentData } from '@yq-editor/global-types'
import InlineEdit from '@/components/InlineEdit.vue'
import { subComponentJoinId } from '@/global'
export default defineComponent({
  components: {
    Draggable,
    EyeOutlined,
    EyeInvisibleOutlined,
    UnlockOutlined,
    LockOutlined,
    InlineEdit,
  },
  props: {
    components: {
      type: Array as PropType<ComponentData[]>,
      required: true,
    },
    currentComponentId: {
      type: [String, Number, Object],
      default: '',
    },
  },

  emits: ['change', 'selectLayer'],
  setup(props, context) {
    const handleChange = (id: string, key: string, value: boolean) => {
      context.emit('change', { id, key, value, isRoot: true })
    }
    const handleClick = (id: string) => {
      context.emit('selectLayer', id)
    }

    return {
      handleChange,
      handleClick,
      subComponentJoinId,
    }
  },
})
</script>

<template>
  <!--  图层设置 -->
  <!--  插件https://github.com/SortableJS/vue.draggable.next -->
  <Draggable
    class="list-group"
    :list="components"
    v-bind="{
      animation: 200,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost',
    }"
    item-key="id"
  >
    <template #item="{ element }">
      <li>
        <div
          :class="{ active: element.id === currentComponentId }"
          class="list-group-item "
          @click.stop="handleClick(element.id)"
        >
          <InlineEdit
            class="edit-area ellipsis"
            :value="element.layerName"
            @change="
              (value) => {
                handleChange(element.id, 'layerName', value)
              }
            "
          />
          <div>
            <a-button
              class="btn-icon"
              shape="circle"
              @click.stop="
                handleChange(element.id, 'isHidden', !element.isHidden)
              "
            >
              <template v-if="element.isHidden" #icon>
                <EyeInvisibleOutlined />
              </template>

              <template v-else #icon>
                <EyeOutlined />
              </template>
            </a-button>
            <a-button
              class="btn-icon"
              shape="circle"
              @click.stop="
                handleChange(element.id, 'isLocked', !element.isLocked)
              "
            >
              <template v-if="element.isLocked" #icon>
                <LockOutlined />
              </template>

              <template v-else #icon>
                <UnlockOutlined />
              </template>
            </a-button>
          </div>
        </div>

        <!-- 子组件 -->
        <ul v-if="element.props.subComponent" class="sub-component-box">
          <li
            v-for="(item, subIndex) in element.props.subComponent"
            :key="item + element.id"
            :class="{
              active:
                `${element.id}${subComponentJoinId}${item.id || subIndex}`
                === currentComponentId,
            }"
            class="list-group-item ellipsis"
            @click.stop="
              handleClick(
                `${element.id}${subComponentJoinId}${item.id || subIndex}`,
              )
            "
          >
            组件id {{ subIndex }}
          </li>
        </ul>
      </li>
    </template>
  </Draggable>
</template>

<style lang="less">
.list-group-item {
  height: 40px;
  cursor: move;
  box-sizing: border-box;
  margin: 0 6px;
  border-radius: 6px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // max-width: 200px;
  &:hover {
    background-color: #0000000f;
  }
  &.active {
    background-color: #3662ec4d;
  }
}
.ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
}
.sub-component-box {
  margin-left: 16px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.btn-icon {
  margin-right: 10px;
}
</style>
