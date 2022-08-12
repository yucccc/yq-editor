<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import myHeader from '@/components/Header.vue'
import { getTemplateWorksApi } from '@/api/index'

export default defineComponent({
  name: 'Home',
  components: {
    MyHeader: myHeader,
  },
  setup() {
    const searchVal = ref('')
    const templateList = reactive({ values: [] })
    const pageInfo = reactive({
      pageIndex: 1,
      pageSize: 10,
    })
    const total = ref(0)
    const findParams = computed(() => {
      const params: {
        pageIndex: number
        pageSize: number
        title?: string
        isTemplate: true
      } = {
        ...pageInfo,
        isTemplate: true,
      }
      return params
    })

    watch(
      findParams,
      async () => {
        await getTemplateWorks()
      },
      { immediate: true },
    )

    async function getTemplateWorks(params?: Object) {
      const _params: any = {
        ...findParams.value,
        ...params,
      }
      searchVal.value && (_params.title = searchVal.value)
      const res = await getTemplateWorksApi(_params)
      templateList.values = res?.data?.list || []
      total.value = res?.data?.total || 0
    }
    const pageChange = (pageIndex: number, pageSize: number) => {
      pageInfo.pageIndex = pageIndex
      pageInfo.pageSize = pageSize
    }

    const onSearch = async function () {
      await getTemplateWorks()
    }

    return {
      searchVal,
      onSearch,
      templateList,
      pageChange,
      pageInfo,
      total,
    }
  },
})
</script>

<template>
  <div class="home">
    <a-layout style="height: 100%">
      <MyHeader style="flex: initial" />
      <a-layout-content>
        <div class="input-search">
          <a-input-search
            v-model:value="searchVal"
            placeholder="通过标题搜索模板"
            style="width: 600px"
            @search="onSearch"
          />
        </div>

        <div class="card-wrapper">
          <div v-show="!templateList.values.length" style="text-align: center; padding-top: 50px">
            无模板
          </div>
          <a-row :gutter="[16, 32]">
            <a-col v-for="template in templateList.values" :key="template._id" :span="4">
              <a-card hoverable>
                <template #cover>
                  <img alt="example" :src="template.contentId.props.screenshotImage">
                </template>
                <a-card-meta :title="template.title">
                  <template #description>
                    <div>{{ `描述：${template.desc}` }}</div>
                    <div>{{ `作者：${template.author}` }}</div>
                    <div>
                      {{ `更新时间：${template.latestPublishAt.split('T')[0]}` }}
                    </div>
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
  <a-pagination
    v-model:current="pageInfo.pageIndex"
    v-model:pageSize="pageInfo.pageSize"
    show-size-changer
    :total="total"
    @change="pageChange"
    @showSizeChange="pageChange"
  />
</template>

<style lang="less" scoped>
.home {
  height: 100vh;
}
.input-search {
  padding: 15px 0;
  text-align: center;
}
.card-wrapper {
  box-sizing: border-box;
  padding: 0 6% 15px;
}
.ant-pagination {
  position: fixed;
  bottom: 5%;
  right: 5%;
}
</style>
