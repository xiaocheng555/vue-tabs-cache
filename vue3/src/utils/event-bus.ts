import mitt from 'mitt'

type Events = {
  'LayoutTabs:closeTab'?: string
  'LayoutTabs:setTabTitle': string
}

const EventBus = mitt<Events>()
export default EventBus