<script lang="ts" setup>
/**
 * 属性面板映射渲染
 * 主要负责的事情是将编辑的属性进行分类 渲染成对应的组件
 */
import { computed, withDefaults } from 'vue'
import { isEmpty, map, pick } from 'lodash-es'
import type { Properties } from 'csstype'
import type { ComponentData } from '@yq-editor/global-types'
import type { AllProps, PropsToForms } from '@/config/propsMap'
import { mapPropsToForms, mapPropsToForms2 } from '@/config/propsMap'
import RenderVnode from '@/components/RenderVnode'
const props = withDefaults(defineProps<Props>(), {
  properties: () => ({}),
})

const emit = defineEmits(['change'])

interface Props {
  properties: {
    [key: string]: any
  } & Properties
  currentElement?: ComponentData
}

// 如果是组件 那么需要把不属于自身属性放到另外的渲染条件中
const pickComponentPropsForm = function (
  currentElementName: keyof AllProps,
) {
  return mapPropsToForms[currentElementName] || {}
}

const mapProperties = (
  properties: PropsToForms,
  currentElementName: string,
) => {
  const _mapPropsToForms = {
    ...mapPropsToForms,
    ...pickComponentPropsForm(currentElementName),
  }

  return map(properties, (propertiesValue, key) => {
    const item = _mapPropsToForms[key]

    if (item) {
      const {
        valueProp = 'value',
        eventName = 'change',
        afterTransform,
        initialTransform,
      } = item
      return {
        ...item,
        valueProp,
        value: initialTransform
          ? initialTransform(propertiesValue, properties)
          : propertiesValue,

        events: {
          [eventName]: (e: any) => {
            emit('change', {
              key,
              value: afterTransform ? afterTransform(e, properties) : e,
            })
          },
        },
      }
    }
  }).filter(Boolean)
}

const finalProps = computed(() => {
  return [
    // @ts-expect-error 原因不明
    ...mapProperties(props.properties, props.currentElement?.name),
  ]
})

const finalProps2 = computed(() => {
  return map(mapPropsToForms2, (item) => {
    // 只取出需要的值 否则可能会导致子组件不必要更新
    const propValues = pick(props.properties, item.propKeys)
    // 值为空
    if (isEmpty(propValues)) {
      return null
    }

    // // 值为一个 取出value作为value传入
    // if (item.propKeys.length === 1) {
    //   propValues = propValues[Object.keys(propValues)[0]]
    // }

    const { initialTransform, eventName = 'change', afterTransform } = item
    return {
      ...item,
      value: initialTransform
        ? initialTransform(propValues, props.properties)
        : propValues,
      events: {
        // 往上传递
        [eventName]: (e: { key: string ; value: any }) => {
          emit('change', {
            // 要变更的key
            key: e.key,
            value: afterTransform
              ? afterTransform(e.value, props.properties)
              : e.value,
          })
        },
      },
    }
  })
})
</script>

<template>
  <template v-for="(propsItem, index) in finalProps2">
    <div v-if="propsItem" :key="index" class="panel-box">
      <div v-if="propsItem.text" class="label-box panel-label-box">
        <span v-if="propsItem.text" class="label">{{ propsItem.text }}</span>
      </div>
      <component
        :is="propsItem.component"
        :value="propsItem.value"
        v-bind="propsItem.extraProps"
        v-on="propsItem.events"
      />
    </div>
  </template>

  <div v-for="(propsItem, index) in finalProps" :key="index" class="panel-box">
    <div class="label-box panel-label-box">
      <span v-if="propsItem.text" class="label">{{ propsItem.text }}</span>
      <!-- <span>编辑</span> -->
    </div>
    <div>
      <component
        :is="propsItem.component"
        :[propsItem.valueProp]="propsItem.value"
        v-bind="propsItem.extraProps"
        v-on="propsItem.events"
      >
        {{ propsItem.slot }}
        <template v-if="propsItem.subComponent">
          <component
            :is="propsItem.subComponent"
            v-for="(option, k) in propsItem.options"
            :key="k"
            :value="option.value"
          >
            <RenderVnode :node="option.text" />
          </component>
        </template>
      </component>
    </div>
  </div>
</template>

<style lang="less" scoped>
.panel-box {
  margin-bottom: 16px;

  .panel-label-box {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    color: #9da3ac;
    user-select: none;
  }
  .panel-label {
    user-select: none;
  }
  .panel-action {
    color: #9da3ac;
    font-weight: 400;
    cursor: pointer;
  }
}
.panel-box:last-of-type {
  padding-bottom: 20px;
}
</style>
