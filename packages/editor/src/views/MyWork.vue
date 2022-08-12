<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { cloneDeep, debounce } from 'lodash-es'
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  RedoOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { Empty, message } from 'ant-design-vue'
import { setUrlQuery } from '@yq-editor/shared'
import { previewDomain } from '@/global'
import { createWorkByWorkApi, generateJson, patchWorkApi } from '@/api/works'
import myHeader from '@/components/Header.vue'
import { getMyWorksApi } from '@/api/user'
import PreSetting from '@/components/PreSetting.vue'
import { useEditorStore } from '@/store/editor'
import { deletePresentationWorkApi, getPresentationWorkApi, sendPresentationWorkApi } from '@/api/presentationWorks'

export default defineComponent({
  name: 'MyWork',
  components: {
    MyHeader: myHeader,
    EyeOutlined,
    DeleteOutlined,
    ShareAltOutlined,
    CopyOutlined,
    PreSetting,
    EllipsisOutlined,
  },
  setup() {
    const searchVal = ref('')
    const myWorkList = reactive({ values: [] })
    const type = ref('all')
    const pageInfo = reactive({
      pageIndex: 1,
      pageSize: 10,
    })
    const total = ref(0)
    const showSendModel = ref(false)
    const formState = reactive<{ name: string }>({
      name: '',
    })
    const state = reactive({
      settingModalVisible: false,
      // mode控制cdn是否能改动
      mode: 'createByWork',
      type: '',
    })
    const router = useRouter()
    const selectedSendWordIndex = ref<undefined | number>()
    const store = useEditorStore()
    const selectedForCreateWork = reactive<Record<string, any>>({})
    const hoverId = ref<string>('')
    const hoverIdCanChange = ref<boolean>(true)

    // 从接口中获取 和默认合并 此时vuex可能还无数据
    const goEditor = (item: any) => {
      if (item.status == 0) { return }
      router.push({
        path: `/editor/${item._id}`,
        query: item.contentId.preSetting.userInfo,
      })
    }
    const goPreivew = async (item: any, isOnline: boolean, isPresent = false) => {
      if (isOnline) {
        window.open(item.online, '_blank')
        return
      }
      const work = isPresent
        ? {
            _id: item.from.workId,
            uuid: item.from.uuid,
            contentId: item.contentId,
          }
        : item
      await generateJson(work._id)
      window.open(
        setUrlQuery(work.contentId.preSetting.userInfo, `${previewDomain}:9995/?jsonName=${work._id}-${work.uuid}&mode=preview`),
        '_blank',
      )
    }
    const goDelete = async (item: any) => {
      item.status = 0
      await patchWorkApi(item._id, item)
      await getMyWorkList()
      message.success('删除成功，可去已删除列表查看')
    }
    const goDeletePresent = async (item: any) => {
      await deletePresentationWorkApi(item.presentationWorkId)
      await getMyWorkList()
      message.success('删除成功')
    }
    const goRecover = async (item: any) => {
      item.status = 1
      await patchWorkApi(item._id, item)
      await getMyWorkList()
      message.success('恢复成功，可去未发布列表查看')
    }
    const pageChange = (pageIndex: number, pageSize: number) => {
      pageInfo.pageIndex = pageIndex
      pageInfo.pageSize = pageSize
    }

    const findParams = computed(() => {
      const params: {
        pageIndex: number
        pageSize: number
        title?: string
        isTemplate?: boolean
        isPublished?: boolean
        status?: number
        isPresent?: boolean
      } = {
        ...pageInfo,
      }
      type.value === 'template' && (params.isTemplate = true)
      type.value === 'published' && ((params.isPublished = true), (params.status = 2))
      type.value === 'unPublish' && ((params.isPublished = false), (params.status = 1))
      type.value === 'delete' && (params.status = 0)
      type.value === 'receipts' && (params.isPresent = true)
      return params
    })
    watch(type, async () => {
      const res: any = []
      myWorkList.values = res
      pageInfo.pageIndex = 1
    })
    watch(
      findParams,
      async () => {
        await getMyWorkList()
      },
      { immediate: true },
    )

    async function onSearch() {
      await getMyWorkList()
    }

    async function getMyWorkList(params?: Object) {
      const _params: any = {
        ...findParams.value,
        ...params,
      }
      searchVal.value && (_params.title = searchVal.value)
      const res = findParams.value.isPresent ? await getPresentationWorkApi(_params) : await getMyWorksApi(_params)
      // const presentRes = await getPresentationWorkApi(_params)
      const list = res?.data?.list || []
      myWorkList.values = _params.status == 0 ? list : list.filter((item: any) => item.status != 0)
      // myPresentationWorkList.values = presentRes?.data?.list || []
      total.value = res?.data?.total || 0
    }

    function handleClickSendWork(index: number | undefined) {
      selectedSendWordIndex.value = index
      showSendModel.value = true
    }

    async function onFinish(values: { name: any }) {
      const { name } = values
      await sendWork(name)
      formState.name = ''
    }

    async function sendWork(name: any) {
      const { author, _id, uuid, contentId = {} } = myWorkList.values[selectedSendWordIndex.value] || {}

      try {
        const res = await sendPresentationWorkApi({
          recipient: name,
          workData: {
            author,
            _id,
            uuid,
            contentId: contentId._id,
          },
        })

        message.success('赠送成功')
        showSendModel.value = false
      }
      catch (error) {
        if (error.code === 14000) {
          message.error('该作品已经赠送过该用户')
          return
        }
        message.error(`${error.code} ${error.message}`)
      }
    }

    const onCancel = () => {
      state.settingModalVisible = false
    }
    const onConfirm = (result: any) => {
      state.settingModalVisible = false
      const { from, author, _id, uuid } = selectedForCreateWork.values
      const content = cloneDeep(selectedForCreateWork.values.contentId)
      content.preSetting = {
        ...content.preSetting,
        cdnUrl: result.cdnUrl,
        shortName: result.shortName,
      }
      createWorkByWorkApi({
        workData: {
          from:
            state.type === 'byPresentationWork'
              ? from
              : {
                  author,
                  workId: _id,
                  uuid,
                },
        },
        content,
        type: state.type,
      })
        .then((res) => {
          router.push({
            path: `/editor/${res.data._id}`,
            query: result.userInfo,
          })
          // 创建成功 清楚上一个模板vuex信息
          store.resetEditorState()
          // 存入信息
          // result.workId = res.data._id
          // store.commit('updatePreSetting', result)
        })
        .catch((err) => {
          console.log(`创建失败${JSON.stringify(err)}`)
        })
    }
    const createWork = async (index: string | number, type: string) => {
      selectedForCreateWork.values = myWorkList.values[index]
      state.type = type
      state.settingModalVisible = true
    }
    // 避免闪烁
    const setHoverId = debounce((v: string) => {
      if (hoverIdCanChange.value) {
        hoverId.value = v
      }
    }, 100)

    const handlePopConfirmChange = (v: boolean) => {
      // 显示删除确认弹窗时，不可删除hoverId
      hoverIdCanChange.value = !v
    }

    return {
      goEditor,
      goPreivew,
      goDelete,
      goRecover,
      type,
      myWorkList,
      searchVal,
      pageInfo,
      pageChange,
      onSearch,
      total,
      showSendModel,
      formState,
      onFinish,
      handleClickSendWork,
      goDeletePresent,
      createWork,
      state,
      selectedForCreateWork,
      onCancel,
      onConfirm,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      hoverId,
      setHoverId,
      message,
      handlePopConfirmChange,
    }
  },
})
</script>

<template>
  <MyHeader />
  <div class="input-search">
    <a-input-search v-model:value="searchVal" placeholder="通过标题搜索模板" style="width: 600px" @search="onSearch" />
  </div>
  <div class="card-wrapper">
    <a-radio-group v-model:value="type" class="a-radio-group-my">
      <a-radio-button value="all">
        全部
      </a-radio-button>
      <a-radio-button value="published">
        已发布
      </a-radio-button>
      <a-radio-button value="unPublish">
        未发布
      </a-radio-button>
      <a-radio-button value="template">
        模板
      </a-radio-button>
      <a-radio-button value="delete">
        已删除
      </a-radio-button>
      <a-radio-button value="receipts">
        收到的
      </a-radio-button>
    </a-radio-group>
    <a-empty v-show="!myWorkList.values.length" :image="simpleImage" />

    <a-row :gutter="[16, 32]">
      <a-col v-for="(item, index) in myWorkList.values" :key="item._id" :span="3">
        <!-- 作品类型：收到的 -->
        <a-card
          v-if="item.presentationWorkId"
          hoverable
          bordered
          @mouseenter="setHoverId(item._id)"
          @mouseleave.self="setHoverId('')"
        >
          <template #cover>
            <img
              alt="example"
              :src="item.contentId.props ? item.contentId.props.screenshotImage : ''"
              @click="goEditor(item)"
            >

            <div v-show="hoverId === item._id" class="cover-hov">
              <a-button class="btn" type="round" @click="createWork(index, 'byPresentationWork')">
                复制
              </a-button>
            </div>
          </template>
          <a-card-meta v-if="hoverId !== item._id" title="">
            <template #description>
              <div class="text">
                <!-- <div>{{ `ID：${item._id}` }}</div> -->
                <!-- <div>{{ `描述：${item.desc}` }}</div> -->
                <!-- <div>{{ `作者：${item.author}` }}</div> -->
                <h3>{{ item.contentId.baseSetting.title || 'page title' }}</h3>
                <div>
                  {{ item.presentDate ? item.presentDate.split('T')[0] : '' }}
                </div>
                <div>
                  {{ item.from.author }}
                </div>
              </div>
            </template>
          </a-card-meta>
          <template v-if="hoverId === item._id" #actions class="ant-card-actions">
            <a-dropdown placement="top">
              <div class="btn">
                <EyeOutlined />
                <span class="text">预览</span>
              </div>
              <template #overlay>
                <a-menu @mouseenter="setHoverId(item._id)">
                  <a-menu-item key="local">
                    <span @click="goPreivew(item, false, true)">本地预览</span>
                  </a-menu-item>
                  <a-menu-item v-if="item.online" key="online">
                    <span @click="goPreivew(item, true)">线上地址</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-popconfirm
              title="确定删除吗?删除后不可恢复"
              ok-text="确定"
              cancel-text="取消"
              @visibleChange="handlePopConfirmChange"
              @confirm="goDeletePresent(item)"
            >
              <div class="btn">
                <DeleteOutlined />
                <span class="text">删除</span>
              </div>
            </a-popconfirm>
          </template>
        </a-card>
        <!-- 作品类型：已删除 -->
        <a-card
          v-else-if="item.status === 0"
          hoverable
          bordered
          @mouseenter="setHoverId(item._id)"
          @mouseleave.self="setHoverId('')"
        >
          <template #cover>
            <img
              alt="example"
              :src="item.contentId.props ? item.contentId.props.screenshotImage : ''"
              @click="goEditor(item)"
            >

            <div v-show="hoverId === item._id" class="cover-hov">
              <a-popconfirm title="默认恢复到未发布模块，确定恢复吗?" @confirm="goRecover(item)">
                <a-button class="btn" type="round">
                  恢复
                </a-button>
              </a-popconfirm>
            </div>
          </template>
          <a-card-meta v-if="hoverId !== item._id" title="">
            <template #description>
              <div class="text">
                <!-- <div>{{ `ID：${item._id}` }}</div> -->
                <!-- <div>{{ `描述：${item.desc}` }}</div> -->
                <!-- <div>{{ `作者：${item.author}` }}</div> -->
                <h3>{{ item.contentId.baseSetting.title || 'page title' }}</h3>
                <div>
                  {{ item.latestPublishAt ? item.latestPublishAt.split('T')[0] : '' }}
                </div>
              </div>
            </template>
          </a-card-meta>
          <template v-if="hoverId === item._id" #actions>
            <a-dropdown placement="top">
              <div class="btn">
                <EyeOutlined />
                <span class="text">预览</span>
              </div>
              <template #overlay>
                <a-menu @mouseenter="setHoverId(item._id)">
                  <a-menu-item key="local">
                    <span @click="goPreivew(item, false, true)">本地预览</span>
                  </a-menu-item>
                  <a-menu-item v-if="item.online" key="online">
                    <span @click="goPreivew(item, true)">线上地址</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-popconfirm
              title="此处删除操作不可逆，确定删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @visible-change="handlePopConfirmChange"
              @mouseenter="setHoverId(item._id)"
              @confirm="message.success('尚未实现')"
            >
              <div class="btn">
                <DeleteOutlined />
                <span class="text">删除</span>
              </div>
            </a-popconfirm>
          </template>
        </a-card>
        <!-- 作品类型：已发布 未发布 模板 -->
        <a-card v-else hoverable bordered @mouseenter="setHoverId(item._id)" @mouseleave.self="setHoverId('')">
          <template #cover>
            <img
              alt="example"
              :src="item.contentId.props ? item.contentId.props.screenshotImage : ''"
              @click="goEditor(item)"
            >

            <div v-show="hoverId === item._id" class="cover-hov">
              <!-- <div class="cover-hov"> -->
              <a-dropdown placement="bottomRight">
                <EllipsisOutlined class="ellipsis" />
                <template #overlay>
                  <a-menu @mouseenter="setHoverId(item._id)">
                    <a-menu-item key="del">
                      <a-popconfirm title="确定删除吗?" ok-text="确定" cancel-text="取消" @confirm="goDelete(item)">
                        <DeleteOutlined />
                        删除
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <a-button class="btn" type="round" @click="goEditor(item)">
                编辑
              </a-button>
            </div>
          </template>
          <a-card-meta v-if="hoverId !== item._id" title="">
            <template #description>
              <div class="text">
                <h3>{{ item.contentId.baseSetting.title || 'page title' }}</h3>
                <div>
                  {{ item.latestPublishAt ? item.latestPublishAt.split('T')[0] : '' }}
                </div>
              </div>
            </template>
          </a-card-meta>
          <template v-if="hoverId === item._id" #actions class="ant-card-actions">
            <a-dropdown placement="top">
              <div class="btn">
                <EyeOutlined />
                <span class="text">预览</span>
              </div>
              <template #overlay>
                <a-menu @mouseenter="setHoverId(item._id)">
                  <a-menu-item key="local">
                    <span @click="goPreivew(item)">本地预览</span>
                  </a-menu-item>
                  <a-menu-item v-if="item.online" key="online">
                    <span @click="goPreivew(item, true)">线上地址</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <div class="btn" @click="handleClickSendWork(index)">
              <ShareAltOutlined />
              <span class="text">分享</span>
            </div>
            <div class="btn" @click="createWork(index, 'byWork')">
              <CopyOutlined @click="createWork(index, 'byWork')" />
              <span class="text">复制</span>
            </div>
          </template>

          <!-- <div class="action-box">
            <div class="action">
              <template v-if="item.status != 0">
                <span @click="goEditor(item)"><edit-outlined /></span>
                <span @click="goPreivew(item)"><eye-outlined /></span>
          <span>

          </span>
          <span>
            <ShareAltOutlined @click="handleClickSendWork(index)" />
          </span>
          <span>
            <a-popconfirm title="确定删除吗?" ok-text="确定" cancel-text="取消" @confirm="goDelete(item)">
              <delete-outlined />
            </a-popconfirm>
          </span>
</template>
              <template v-else>
                <span v-if="item.status == 0 && type == 'delete'">
                  <a-popconfirm
                    title="默认恢复到未发布模块，确定恢复吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="goRecover(item)"
                  >
                    <redo-outlined />
                  </a-popconfirm>
                </span>
              </template>
              <span>
                <a-tooltip>
                  <template #title>复制出新的作品</template>
                  <copy-outlined  />
                </a-tooltip>
              </span>
            </div>
          </div> -->
        </a-card>
      </a-col>
    </a-row>
  </div>
  <a-pagination
    v-model:current="pageInfo.pageIndex"
    v-model:pageSize="pageInfo.pageSize"
    show-size-changer
    :total="total"
    @change="pageChange"
    @showSizeChange="pageChange"
  />
  <a-modal v-model:visible="showSendModel" :footer="null" title="作品赠送">
    <a-form :model="formState" @finish="onFinish">
      <a-form-item label="接收人名称" name="name" :rules="[{ required: true, message: 'Please input name!' }]">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          确定
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <PreSetting
    v-model:visible="state.settingModalVisible"
    :mode="state.mode"
    :value="{}"
    :cdn-sn="selectedForCreateWork.values?.contentId?.preSetting?.shortName"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<style lang="less">
.card-wrapper {
  .ant-card {
    border-radius: 4px 4px;
    overflow: hidden;
  }

  .ant-card-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;

    li {
      width: 30% !important;
      border: none;
    }

    .btn {
      margin: 0;
      display: flex;
      flex-direction: column;
      font-size: 16px;

      .text {
        font-size: 12px;
      }
    }
  }

  .unShow {
    height: 0;
  }

  .ant-card-body,
  .ant-card-actions {
    height: 5.1vw;
  }

  .ant-card-body {
    padding: 15px 10px;
    position: relative;
  }

  .ant-card-cover {
    position: relative;
  }

  .ant-card-bordered .ant-card-cover {
    margin: 0;

    img {
      height: 15vw;
      object-fit: cover;
    }
  }
}
</style>

<style lang="less" scoped>
.my-a-card-box {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
}

.my-a-card {
  width: 200px;
  margin: 40px;
}

.card-wrapper {
  box-sizing: border-box;
  padding: 20px 5% 15px;
}

.input-search {
  padding: 15px 0;
  text-align: center;
}

.ant-pagination {
  position: fixed;
  bottom: 5%;
  right: 5%;
}

.gray {
  position: relative;
  filter: contrast(0.8);
  pointer-events: none;

  &::after {
    content: '已删除';
    position: absolute;
    font-size: 20px;
    color: #bf3232;
    top: 50%;
    left: 50%;
    z-index: 9;
    transform: translate(-50%, -50%);
  }
}

.action-box {
  height: 20px;
  margin-top: 20px;
  text-align: center;

  .anticon {
    margin-right: 6px;
    font-size: 16px;
    color: #666;
  }
}

.action {
  display: flex;
  width: 100%;

  z-index: 9;

  span {
    flex: 1;
    text-align: center;
  }
}

.a-radio-group-my {
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
}

.cover-hov {
  display: grid;
  // display: none;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  place-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px 4px 0 0;

  .ellipsis {
    width: auto;
    position: absolute;
    top: 8px;
    right: 8px;
    color: white;
    font-size: 1.2vw;
  }

  .btn {
    width: 100px;
    background-color: transparent;
    color: #fff;
    margin: 0;

    &:hover {
      background-color: rgba(24, 144, 255);
      // color: #000
    }
  }
}
</style>
