import React, { Component, useContext, useState, useEffect } from 'react';
import RVD, { I_RVD_node } from '../npm/react-virtual-dom/index.tsx';
import AIOInput from '../npm/aio-input/aio-input';
import AIODate from '../npm/aio-date';
import { Icon } from '@mdi/react';
import { mdiArrowRight, mdiChevronDown, mdiChevronUp, mdiClock, mdiClose, mdiComment, mdiDelete, mdiReload, mdiTable } from '@mdi/js';
import { icons } from '../icons';
import Rate from './rate';
import GroupButton from './group-button';
import percent1 from '../svgs/percent1';
import AppContext from '../app-context';
import AIOShop from '../npm/aio-shop/aio-shop';
import ersal_ba_peyk_svg from '../svgs/ersal-ba-peyk';
import daryafte_hozoori_svg from '../svgs/daryafte-hozoori';
import pardakhte_online_src from '../images/pardakhte-online.png';
import pardakhte_kife_pool_src from '../images/pardakhte-kife-pool.png';
import kart_be_kart_src from '../images/kart-be-kart.png';
import pardakhte_hozoori_src from '../images/pardakhte-hozoori.png';
import SplitNumber from '../npm/aio-functions/split-number';
import './restoran-page.css';
import { I_coupon, I_food, I_reserveItem, I_reserveQuantity, I_restoran, I_state } from '../typs';
import { I_AIOShop, I_AIOShop_props, I_AIOShop_factor, I_checkout_item, I_pr, I_cart_product_hasNotVariant } from '../npm/aio-shop/types';
import { I_pardakhteOnline_param } from '../apis/APIClass.tsx';
type I_menu = { [menuCategory: string]: I_food[] };
type I_RestoranPage = { restoran: I_restoran }
type I_tab = 'menu' | 'info' | 'cart' | 'reserve';
export default function RestoranPage(props: I_RestoranPage) {
  let { APIS, rsa, addresses }: I_state = useContext(AppContext);
  let { restoran } = props
  let [activeMenu, setActiveMenu] = useState<string | false>(false);
  let [menu, setMenu] = useState<I_menu | false>(false);
  let [activeTabId, setActiveTabId] = useState<I_tab>('menu');
  let [coupons, setCoupons] = useState<I_coupon | false>(false)
  let [reserveItems, setReserveItems] = useState<I_reserveItem[]>();
  let [Shop, setShop] = useState<I_AIOShop>()
  function getMenu() {
    APIS.backOffice_getRestoranFoods({ restoranId: restoran.id }, {
      onSuccess: (foods: I_food[]) => {
        let menu: I_menu = {}
        let food_dic = {};
        let subFoods = {};
        let activeMenu;
        for (let i = 0; i < foods.length; i++) {
          let food: I_food = foods[i];
          let { menuCategory, parentId, id } = food;
          food_dic[id] = food;
          if (!activeMenu) { activeMenu = menuCategory; }
          if (parentId) {
            subFoods[parentId] = subFoods[parentId] || [];
            subFoods[parentId].push(food);
            continue;
          }
          menu[menuCategory] = menu[menuCategory] || [];
          menu[menuCategory].push(food);
        }
        let keys = Object.keys(subFoods);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          food_dic[key].items = subFoods[key];
        }
        setActiveMenu(activeMenu);
        setMenu(menu)
        this.setState({ subFoods })
      }
    })
  }
  function getCoupons() {
    APIS.getRestoranCoupons({ restoranId: restoran.id }, {
      onSuccess: (coupons: I_coupon[]) => setCoupons(coupons)
    })
  }
  function getReserveItems() {
    APIS.getRestoranReserveItems({ restoranId: restoran.id }, {
      onSuccess: (reserveItems: I_reserveItem[]) => setReserveItems(reserveItems)
    })
  }
  function getShop() {
    let shopProps: I_AIOShop_props = {
      shopId: 'iranfoodrestorancart' + restoran.id,
      unit: 'تومان',
      trans: { addToCart: 'سفارش', notExist: 'نا موجود' },
      cart: 'cache',
      getCheckoutItems,
      quantities:[
        {
          id:'reserve',
          getInitialValue:(product)=>{
            let reserveItem:I_reserveItem = product.data;
            let { minCount } = reserveItem;
            return {count:minCount,hours:[],date:''}
          },
          form:()=><ReserveForm/>,
          getCartInfo:()=>{

          }
        }
      ],
      onPayment: async ({ checkout, cart, getFactor }) => {
        let { restoran } = this.props;
        let { deliveryType, addressId, selectedCouponIds } = checkout;
        let factor: I_AIOShop_factor = await getFactor({ renderIn: 'checkout' })
        let foods = Object.keys(cart).map((o) => { return { foodId: o, count: cart[o].count } })
        let restoranId = restoran.id;
        let { payment } = factor;
        let parameter: I_pardakhteOnline_param = { deliveryType, foods, restoranId, payment, selectedCouponIds, addressId }
        return APIS.pardakhteOnline(parameter)
      }
    }
    let Shop: I_AIOShop = new AIOShop(shopProps)
    setShop(Shop)
  }
  useEffect(() => { getMenu(); getCoupons(); getReserveItems(); getShop(); }, [])
  function getIcon(option) {
    let icon = {
      'ارسال با پیک': () => ersal_ba_peyk_svg(),
      'دریافت حضوری': () => daryafte_hozoori_svg(),
      'پرداخت آنلاین': () => <img src={pardakhte_online_src as string} />,
      'پرداخت کیف پول': () => <img src={pardakhte_kife_pool_src as string} />,
      'کارت به کارت': () => <img src={kart_be_kart_src as string} />,
      'پرداخت حضوری': () => <img src={pardakhte_hozoori_src as string} />,
    }[option];
    return (<div style={{ width: 60 }} className='align-vh'>{icon()}</div>)
  }
  function getCheckoutItems({ getFactor }): I_checkout_item[] {
    let { address } = restoran;
    let res: I_checkout_item[] = [
      {
        type: 'radio', title: 'روش تحویل سفارش', field: 'deliveryType', value: 'ارسال با پیک',
        options: [
          { text: 'ارسال با پیک', value: 'ارسال با پیک', icon: getIcon('ارسال با پیک') },
          { text: 'دریافت حضوری', value: 'دریافت حضوری', icon: getIcon('دریافت حضوری') },
        ]
      },
      {
        type: 'radio',
        show: ({ checkout }) => checkout.deliveryType === 'ارسال با پیک', title: 'آدرس تحویل سفارش', subtitle: 'انتخاب از آدرس های من', field: 'addressId', value: addresses[0].id,
        options: addresses.map(({ address, id }) => { return { text: address, value: id } })
      },
      {
        type: 'html', show: ({ checkout }) => checkout.deliveryType === 'دریافت حضوری', title: 'آدرس تحویل سفارش', subtitle: 'آدرس رستوران', field: 'addressId', value: false,
        html: () => address
      },
      {
        type: 'radio',
        title: 'روش پرداخت مبلغ سفارش', field: 'paymentType', value: 'پرداخت آنلاین',
        options: [
          { text: 'پرداخت آنلاین', value: 'پرداخت آنلاین', icon: getIcon('پرداخت آنلاین'), subtext: 'پرداخت از طریق درگاه های پرداخت ' },
          { text: 'پرداخت کیف پول(10% تخفیف)', value: 'پرداخت کیف پول', icon: getIcon('پرداخت کیف پول'), subtext: 'مانده اعتبار : 250،000 ریال' },
          { text: 'پرداخت حضوری', value: 'پرداخت حضوری', icon: getIcon('پرداخت حضوری'), subtext: 'پرداخت از طریق دستگاه پوز پیک یا فروشگاه' },
          { text: 'کارت به کارت', value: 'کارت به کارت', icon: getIcon('کارت به کارت'), subtext: 'واریز به کارت ایران فود' }
        ]
      },
      { type: 'html', show: ({ checkout }) => checkout.paymentType === 'کارت به کارت', title: 'اطلاعات حساب ایران فود', field: '', value: false, html: () => '6219861033538751' }
    ]
    if (Array.isArray(coupons) && coupons.length) {
      let factor: I_AIOShop_factor = getFactor();
      res.push({
        type: 'radio', title: 'کوپن های تخفیف', field: 'selectedCouponIds', value: [], show: () => true,
        multiple: true,
        options: coupons.map((coupon: I_coupon) => {
          let subtext = '';
          if (coupon.discountPercent) {
            subtext += `${coupon.discountPercent} درصد تخفیف `
          }
          else if (coupon.discount) {
            subtext += `${SplitNumber(coupon.discount)} تومان تخفیف `
          }
          if (coupon.maxDiscount) { subtext += `تا سقف ${SplitNumber(coupon.maxDiscount)} تومان ` }
          if (coupon.minCartAmount) { subtext += `برای سبد بالای ${SplitNumber(coupon.minCartAmount)} تومان ` }
          let disabled = coupon.minCartAmount > factor.payment;
          return { text: coupon.title, subtext, value: coupon.id, disabled }
        })
      })
    }
    return res
  }
  function header_layout(): I_RVD_node {
    let { onClose } = this.props;
    let rate = restoran.rate;
    let image = restoran.image;
    return (
      {
        html: (
          <Header
            rate={rate}
            image={image}
            icons={[
              { icon: <Icon path={mdiClose} size={1} />, onClick: () => onClose() },
            ]}
          />
        )
      }
    )
  }
  function tabs_layout(): I_RVD_node {
    let cartLength = 0;
    if (Shop) { cartLength = (Shop as I_AIOShop).getCartLength() }
    return {
      className: 'm-b-12',
      html: (
        <AIOInput
          type='tabs'
          options={[
            { text: 'منوی رستوران', value: 'menu' },
            { text: 'اطلاعات رستوران', value: 'info' },
            { text: 'رزرو', value: 'reserve' },
            { text: 'سبد خرید', value: 'cart', after: <div className='br-12 p-3 h-12 align-vh' style={{ background: 'orange', color: '#fff' }}>{cartLength}</div> },
          ]}
          value={activeTabId}
          onChange={(activeTabId: I_tab) => setActiveTabId(activeTabId)}
        />
      )
    }
  }
  function category_layout(): I_RVD_node {
    let menuLength = Object.keys(menu).length;
    if (!menuLength || menu === false) { return {} }
    return {
      className: 'p-h-12 m-b-12',
      html: (
        <GroupButton
          type='menu'
          value={[activeMenu]} className='outline'
          options={Object.keys(menu).map((o) => { return { text: o, value: o } })}
          onChange={(values, activeMenu) => setActiveMenu(activeMenu)}
        />
      )
    }
  }
  function foods_layout(): I_RVD_node {
    let { Shop } = this.state;
    if (!Shop || !activeMenu || menu === false) { return {} }
    let foods = menu[activeMenu];
    return {
      gap: 12, flex: 1, className: 'ofy-auto',
      column: foods.map((o) => {
        let { items = [] } = o;
        let html;
        if (items.length) {
          html = (
            <button className='joziate-ghaza button-2' onClick={() => this.openModal('subFoods', o)}>جزییات</button>
          )
        }
        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard({ product: o, addToCart: true, floatHtml: html, type: 'horizontal' }) }
      })
    }
  }
  function openModal(key, parameter) {
    let { Shop, subFoods } = this.state;
    let { addModal } = rsa;
    if (key === 'subFoods') {
      addModal({
        position: 'fullscreen', header: { title: `انواع ${parameter.name}` },
        body: { render: () => <SubFoods food={parameter} subFoods={subFoods} Shop={Shop} /> }
      })
    }
  }
  function menu_layout(): I_RVD_node {
    if (activeTabId !== 'menu' || menu === false) { return {} }
    return { flex: 1, column: [category_layout(), foods_layout()] }
  }
  function info_layout(): I_RVD_node {
    if (activeTabId !== 'info') { return {} }
    let { restoran } = this.props;
    return {
      flex: 1,
      html: <RestoranInfo {...restoran} header={false} />
    }
  }
  function cart_layout(): I_RVD_node {
    let { Shop } = this.state;
    if (activeTabId !== 'cart') { return {} }
    return {
      flex: 1,
      html: Shop.renderCart()
    }
  }
  function reserve_layout(): I_RVD_node {
    let { Shop } = this.state;
    if (!Shop || activeTabId !== 'reserve') { return {} }
    let { restoran } = this.props;
    return {
      flex: 1, className: 'restoran-reserve-container h-100',
      html: (
        <RestoranReserve
          reserveItems={reserveItems} restoranId={restoran.id} Shop={Shop}
        />
      )
    }
  }
  if (coupons === false || menu === false) {
    return (
      <RVD
        layout={{
          className: 'restoran-page', align: 'vh',
          column: [
            { html: 'خطا در دریافت اطلاعات' },
            {
              html: (
                <button><Icon path={mdiReload} size={0.8} />تلاش مجدد</button>
              )
            }
          ]
        }}
      />
    )
  }

  return (
    <>
      <RVD
        layout={{
          className: 'restoran-page',
          column: [
            header_layout(),
            tabs_layout(),
            menu_layout(),
            info_layout(),
            cart_layout(),
            reserve_layout()
          ]
        }}
      />
      {Shop && Shop.renderPopups()}
    </>
  )
}
type I_SubFoods = {Shop:I_AIOShop,food:I_food,subFoods:I_food[]}
function SubFoods(props:I_SubFoods) {
  let { Shop,food, subFoods } = props;  
  function foods_layout(foods) {
    return {
      flex: 1, className: 'ofy-auto', gap: 12,
      column: foods.map((o) => {
        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard({ product: o, cartButton: true, type: 'h' }) }
      })
    }
  }
    let foods = subFoods[food.id];
    return (
      <RVD
        layout={{
          style: { background: '#f8f8f8', height: '100%' },
          column: [
            { size: 12 },
            foods_layout(foods)
          ]
        }}
      />
    )
}
type I_Header_icon = { icon: React.ReactNode,show?:boolean | (()=>boolean),onClick:()=>void };
type I_Header = { icons: I_Header_icon[], rate?: number, image: any, title?: string }
function Header(props: I_Header) {
  let { icons = [], rate, image, title } = props;
  function renderIcons(icons) {
    let gap = 8,size = 36;
    icons = icons.filter((icon:I_Header_icon) => {
      let {show = true} = icon;
      return typeof show === 'function' ? show() : show
    })
    return icons.map(({ icon, onClick, badge }, i) => {
      return (
        <div
          onClick={onClick}
          style={{
            position: 'absolute', background: '#ffffffdd', borderRadius: 6, display: 'flex',
            left: ((i + 1) * gap) + (i * size), top: 8, width: 36, height: 36
          }}
          className='align-vh'
        >
          {icon}
          {!!badge && <div className='badge-1'>{badge}</div>}
        </div>
      )
    })
  }
  function renderTitle(title) {
    if (!title) { return null }
    return (
      <div
        style={{
          position: 'absolute', background: '#ffffffdd', borderRadius: 6, display: 'flex', padding: '0 12px',
          right: 8, top: 8, height: 36
        }}
        className='align-vh bold fs-20'
      >
        {title}
      </div>
    )
  }
  return (
    <RVD
      layout={{
        html: (
          <div style={{ position: 'relative', width: '100%' }}>
            <img src={image} width='100%' alt='' style={{ width: '100%' }} />
            {
              !!rate && (
                <div
                  style={{
                    position: 'absolute', background: '#ffffffcc', borderRadius: 6, display: 'flex',
                    right: 8, bottom: 16, width: 96, height: 24, color: 'orange'
                  }}
                  className='align-vh'
                >
                  <Rate rate={rate} />
                </div>
              )
            }
            {renderIcons(icons)}
            {renderTitle(title)}
          </div>
        )
      }}
    />

  )

}
type I_RestoranReserve = { Shop:I_AIOShop, reserveItems:I_reserveItem[], restoranId:any, reserveCacheDictionary, setReserveCacheDictionary }
function RestoranReserve(props:I_RestoranReserve) {
  let { Shop, reserveItems} = props;
  function getProduct(reserveItem:I_reserveItem) {
    let { name, id, data, images } = reserveItem;
    let description = ''
    let countText = data.countType ? `${data.minCount} تا ${data.maxCount} ${data.countUnit}` : '';
    let returnText = data.returnAmount ? `بازگشت مبلغ روی فاکتور` : '';
    let timeText = '';
    if (data.timeType === 'hour') { timeText = 'ساعتی' }
    else if (data.timeType === 'day') { timeText = 'روزانه' }
    if (countText) { description += countText + ' - ' }
    if (timeText) { description += timeText + ' - ' }
    if (returnText) { description += returnText }
    let product:I_pr =  { optionType:'quantity',id, description, name, images, data }
    return product
  }
  return (
    <RVD
      layout={{
        className: 'restoran-reserve h-100 ofy-auto p-12',
        flex: 1, gap: 12,
        column: reserveItems.map((reserveItem) => {
          let product = getProduct(reserveItem);
          return {
            className: 'of-visible', html: Shop.renderProductCard({ product, type: 'h' })
          }
        })
      }}
    />
  )
}
class RestoranInfo extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentsPageSize: 12,
      commentsPageNumber: 1
    }
  }
  componentDidMount() {
    let { apis } = this.context;
    let { id } = this.props;
    let { commentsPageNumber, commentsPageSize } = this.state;
    apis.request({
      api: 'restoran_comments',
      parameter: { id, pageSize: commentsPageSize, pageNumber: commentsPageNumber },
      description: 'دریافت نظرات ثبت شده در مورد رستوران',
      onSuccess: (comments) => this.setState({ comments })
    })
  }
  title_layout(logo, name, rate) {
    let { onClose, header } = this.props;
    if (header === false) { return false }
    return {
      className: 'm-b-12 p-12 orange-bg colorFFF',
      row: [
        { size: 36, html: <Icon path={mdiArrowRight} size={1} />, align: 'vh', onClick: () => onClose() },
        { flex: 1, html: <RestoranTitle {...{ logo, name, rate }} /> }
      ]
    }
  }
  parts_layout(deliveryTime) {
    let { comments } = this.state;
    let parts = [
      { text: `${deliveryTime} دقیقه`, subtext: 'زمان ارسال', icon: mdiClock },
      //{text:`${shippingPrice} ریال`,subtext:'هزینه ارسال',icon:mdiWallet},
      { text: `${comments.length} نظر`, subtext: 'نظرات کاربران', icon: mdiComment },
      { text: `رزرو میز`, subtext: 'مشاهده میزها', icon: mdiTable, color: '#92C020' },
    ]
    return {
      gap: 1,
      className: 'restoran-page-parts',
      row: parts.map((o) => {
        return this.part_layout(o)
      })
    }
  }
  part_layout({ text, subtext, icon, color }) {
    return {
      flex: 1, style: { color }, className: 'restoran-page-part',
      column: [
        { html: <Icon path={icon} size={0.7} />, align: 'vh', style: { color: '#00AD79' } },
        { size: 4 },
        { html: text, className: 'fs-12 bold', align: 'h' },
        { html: subtext, className: 'fs-10', align: 'h' }
      ]
    }
  }
  address_layout(latitude, longitude, address) {
    return {
      className: 'm-b-12 p-h-12', html: <Address {...{ latitude, longitude, address }} />
    }
  }
  downloadMenu_layout() {
    return {
      className: 'm-b-12 p-h-12', html: <button className='button-3 w-100 br-6 h-36'>دانلود منو رستوران</button>
    }
  }
  IranFoodComment_layout(ifRate, ifComment) {
    return {
      className: 'p-h-12', html: <IranFoodComment {...{ ifRate, ifComment }} />
    }
  }
  comments_layout(comments) {
    return { html: <RestoranComments comments={comments} /> }
  }
  render() {
    let { latitude, longitude, address, deliveryTime, logo, name, rate, ifRate, ifComment } = this.props;
    let { comments } = this.state;
    return (
      <RVD
        layout={{
          className: 'h-100',
          column: [
            this.title_layout(logo, name, rate),
            {
              flex: 1, className: 'ofy-auto',
              column: [
                this.parts_layout(deliveryTime, comments),
                this.address_layout(latitude, longitude, address),
                this.downloadMenu_layout(),
                { size: 12 },
                this.IranFoodComment_layout(ifRate, ifComment),
                { size: 12 },
                this.comments_layout(comments)
              ]
            }
          ]
        }}
      />
    )
  }
}
class RestoranCoupons extends Component {
  coupons_layout(coupons) {
    if (!coupons.length) { return false }
    return {
      className: 'm-b-12',
      column: [
        { html: 'کوپن های تخفیف', className: 'fs-14 bold p-h-12' },
        { size: 6 },
        {
          className: 'p-6 ofx-auto',
          style: { background: '#FFC19C' },
          gap: 12, row: coupons.map((o) => this.coupon_layout(o))
        }
      ]
    }
  }
  coupon_layout({ percent, amount }) {
    return {
      style: { background: '#fff' },
      className: 'br-8 p-6',
      row: [
        { html: percent1(), align: 'vh', size: 30 },
        {
          column: [
            { flex: 1 },
            { show: !!percent, html: `${percent} درصد تخفیف`, className: "fs-10 bold" },
            { show: !!amount, html: `تا سقف ${amount / 1000} هزار تومان`, className: 'fs-9' },
            { flex: 1 }
          ]
        }
      ]
    }
  }
  render() {
    return (
      ''
    )
  }
}
class RestoranTitle extends Component {
  logo_layout(logo) {
    if (!logo) { return false }
    return { html: <img src={logo} width='100%' style={{ width: 42, height: 42, border: '1px solid #eee', borderRadius: '100%', background: '#fff' }} /> }
  }
  name_layout(name) {
    return { html: name, className: 'fs-16 bold' }
  }
  distance_layout(distance) {
    if (!distance) { return false }
    return {
      row: [
        { html: icons('location', { color: '#292D32', width: 10, height: 12 }), align: 'vh' },
        { size: 3 },
        { html: () => `${distance} کیلومتر فاصله از شما`, className: 'fs-10 m-t-3', align: 'v' }
      ]
    }
  }
  rate_layout(rate) {
    if (rate === undefined) { return false }
    return { html: <Rate rate={rate} /> }
  }
  render() {
    let { logo, name, distance, rate } = this.props;
    return (
      <RVD
        layout={{
          row: [
            this.logo_layout(logo),
            { size: 6 },
            {
              flex: 1,
              column: [
                this.name_layout(name),
                {
                  row: [
                    this.distance_layout(distance),
                    this.rate_layout(rate)
                  ]
                }
              ]
            }
          ]
        }}
      />
    )
  }
}
class RestoranComments extends Component {
  header_layout() {
    return { html: 'نظرات کاربران', className: 'fs-14 bold m-b-6' }
  }
  comments_layout(comments) {
    return { column: comments.map((o, i) => this.comment_layout(o, i === 0, i === comments.length - 1)) }
  }
  comment_layout({ name, date, comment }, isFirst, isLast) {
    return {
      style: { borderBottom: '1px solid #eee', background: '#fff' },
      className: 'p-6 br-6' + (isFirst ? '' : ' br-t-0') + (isLast ? '' : ' br-b-0'),
      column: [
        {
          size: 36,
          row: [
            this.name_layout(name),
            { flex: 1 },
            this.date_layout(date)
          ]
        },
        { html: comment, className: 'fs-12' },
        { size: 12 }
      ]
    }
  }
  name_layout(name) {
    return { html: name, className: 'fs-12 bold', align: 'v' }
  }
  date_layout(date) {
    let { day, hour, minute } = AIODate().getDelta({ date });
    let html;
    if (day) { html = `${day} روز پیش` }
    else if (hour) { html = `${hour} ساعت پیش` }
    else if (minute) { html = `${minute} دقیقه پیش` }
    else { html = 'چند لحظه پیش' }
    return { html, className: 'fs-10 bold', align: 'v' }
  }
  render() {
    let { comments } = this.props;
    return (
      <RVD
        layout={{
          style: { background: '#eee' },
          className: 'p-12 br-12',
          column: [
            this.header_layout(),
            this.comments_layout(comments)
          ]
        }}
      />
    )
  }
}
class Address extends Component {
  map_layout(latitude, longitude) {
    return {
      html: (
        <AIOInput
          type='map' lat={latitude} lng={longitude}
          mapConfig={{ draggable: false }}
          style={{ width: 84, height: 84, borderRadius: 12 }}
        />
      )
    }
  }
  address_layout(address) {
    return { flex: 1, html: address, className: 'fs-14' }
  }
  render() {
    let { address, latitude, longitude } = this.props;
    return (
      <RVD
        layout={{
          row: [
            this.map_layout(latitude, longitude),
            { size: 12 },
            this.address_layout(address)
          ]
        }}
      />
    )
  }
}
type I_IranFoodComment = {}
function IranFoodComment(props:I_IranFoodComment) {
  let [showMore,setShowMore] = useState<boolean>(false)
  function header_layout(ifRate):I_RVD_node {
    return {
      className: 'm-b-12 fs-14 bold',
      row: [
        { html: 'نظر تخصصی ایران فود' },
        { flex: 1 },
        { html: 'امتیاز ایران فود', className: 'fs-12', align: 'v' },
        { size: 3 },
        { html: <Rate rate={ifRate} />, align: 'v', style: { color: 'orange' } }
      ]
    }
  }
  function body_layout(ifComment) {
    return {size: showMore ? undefined : 96,className: 'fs-12 m-b-12', html: ifComment}
  }
  function footer_layout():I_RVD_node {
    return {
      className: 'colorGreen bold fs-14',
      row: [
        { flex: 1 },
        { html: !showMore ? 'بیشتر' : 'کمتر', onClick: () => setShowMore(!showMore) },
        { html: <Icon path={!showMore ? mdiChevronDown : mdiChevronUp} size={.8} />, align: 'vh' }
      ]
    }
  }
  let { ifRate, ifComment } = this.props;
  return (<RVD layout={{column: [header_layout(ifRate),body_layout(ifComment),footer_layout()]}}/>)
}
type I_ReserveForm = {item:I_reserveItem,restoranId:any,Shop:I_AIOShop,product:I_pr,quantity:I_reserveQuantity,changeQuantity:(newQuantity:I_reserveQuantity)=>void}
function ReserveForm(props:I_ReserveForm) {
  let {APIS}:I_state = useContext(AppContext);
  let {item,product,restoranId,Shop,quantity} = props;
  let { name, images, timeType,countType, description, countUnit } = item;
  let [errors,setErrors] = useState<string[]>([])
  let [capacityOfHours,setCapacityOfHours] = useState<number[]>(new Array(24).fill(0).map(() => 0))
  function changeQuantity(newQuantity:I_reserveQuantity){
    if (item.timeType === 'hour') {
      newQuantity.hours = newQuantity.hours.filter((o) => {
        return hasCapacityInhours([o, o + 1])
      });
    }
    props.changeQuantity(newQuantity)
  }
  async function init(){
    await APIS.getReserveCapacity({ restoranId, reserveItemId: item.id },{
      onSuccess: (capacityOfHours) => setCapacityOfHours(capacityOfHours)
    })
  }
  useEffect(()=>{init()},[])
  function getAfter(text) {return <div className='reserve-panel-input-after'>{text}</div>}
  function row_layout(key, value):I_RVD_node {
    return {row: [{ html: `${key} : `, className: 'fs-12 bold' },{ html: value, className: 'fs-12', flex: 1 }]}
  }
  function getImage(url) {
    return { html: <AIOInput type='image' value={url} preview={true} width={100} height={100} attrs={{ style: { width: 100, height: 100 } }} />, size: 100 }
  }
  function images_layout():I_RVD_node {
    let Images = [];
    for(let i = 0; i < 3; i++){Images.push(getImage(images[i]))}
    return { size: 100, row: [{ flex: 1 }, { row: images }, { flex: 1 }] }
  }
  function day_layout(timeType) {
    if (!timeType) { return {} }
    return {
      label: 'انتخاب روز رزرو',
      input: {
        type: 'datepicker',
        placeholder: 'تایین نشده',
        unit: 'day',
        calendarType: 'jalali',
        startYear: '-0',
        endYear: '+0'
      },
      field: 'value.date',
      validations: [['required']]
    }
  }
  function count_layout() {
    if (!countType) { return {} }
    let {minCount, maxCount,countUnit} = item;
    let label = `تعداد را مشخص کنید (از ${minCount} ${countUnit} تا ${maxCount} ${countUnit})`
    return {
      input: {
        type: 'slider', start: 0, min: minCount, end: maxCount, after: getAfter(countUnit), showValue: 'inline', direction: 'left',
      },
      field: 'value.count', label
    }
  }
  function getDateText() {
    if (timeType === 'hour') {
      //return `1400 از ساعت ${model.hours[0]} تا ساعت ${model.hours[1]}`
      return `برای ساعات ${quantity.hours.join(' ')}`
    }
    else{

    }
    return AIODate().getDateByPattern({ date: quantity.date, pattern: '{year}/{month}/{day}' })
  }
  function result_layout():I_RVD_node {
    if (timeType === 'hour' && (!quantity.hours || !quantity.hours.length)) {
      errors = errors.concat('ساعات رزرو را انتخاب کنید')
    }
    if (errors.length) {
      return {
        align: 'vh',
        style: { color: 'red', padding: 12, borderRadius: 12, background: '#ff000020' },
        column: errors.map((error) => {
          return { size: 36, align: 'v', html: error }
        })
      }
    }
    return {
      style: { color: 'green', padding: 12, borderRadius: 12, background: '#00800020' },
      column: [
        { html: `رزرو ${name}` },
        { show: !!quantity.count, html: `به تعداد ${quantity.count} ${countUnit}` },
        { show: !!quantity.date, html: `برای تاریخ ${quantity.date}` },
        { show: !!quantity.hours && !!quantity.hours.length, html: `برای ساعات ${quantity.hours.join(' ')}` }

      ]
    }
  }
  function getHoursCapacity() {
    let { count, date } = quantity;
    if (!date) { return [] }
    let res = [];
    for (let i = 0; i < capacityOfHours.length; i++) {
      let o = capacityOfHours[i]
      if (o >= count) { res.push(i) }
    }
    return res
  }
  function hasCapacityInhours(hours) {
    let hoursCapacity = getHoursCapacity();
    for (let i = hours[0]; i < hours[1]; i++) {
      if (hoursCapacity.indexOf(i) === -1) { return false }
    }
    return true
  }
  function hours_layout():I_RVD_node {
    let { countType, timeType } = item;
    if (timeType !== 'hour') { return {} }
    let hoursCapacity = getHoursCapacity();
    if (!hoursCapacity.length) { return {} }
    let { hours } = quantity;
    return {
      column: [
        { html: `ساعات قابل رزرو ${countType ? 'برای تعداد انتخاب شده ' : ''}در روز انتخاب شده`, className: 'aio-input-form-label' },
        {
          html: (
            <div style={{}}>
              {capacityOfHours.map((o, i) => {
                let active = hours.indexOf(i) !== -1;
                let disabled = !hasCapacityInhours([i, i + 1])
                return (
                  <div
                    onClick={() => {
                      if (disabled) { return }
                      let { hours } = quantity;
                      let newHours = active ? hours.filter((h) => h !== i) : hours.concat(i)
                      changeQuantity({ ...quantity, hours: newHours })
                    }}
                    className={'reserve-page-hour-item' + (active ? ' active' : '') + (disabled ? ' disabled' : '')}
                  >{`${i} : 00`}</div>
                )
              })}
            </div>
          )
        }
      ]
    }

  }
  function footer_layout():I_RVD_node {
    let { discountPercent = 0 } = item;
    let disabled = false;
    let cartCount = Shop.getCartCount(item.id);
    let price = item.price * cartCount
    if (item.countType) {
      if (!quantity.count) { disabled = true }
      price *= quantity.count;
    }
    if (item.timeType === 'hour') {
      if (quantity.hours.length === 0) { disabled = true }
      price *= quantity.hours.length;
    }
    return {
      className: 'reserve-page-footer',
      row: [
        {
          show: !!price, align: 'v',
          column: [
            {
              show: !!discountPercent,
              gap: 12, align: 'v',
              row: [
                { html: <del>{`${SplitNumber(price)}`}</del>, className: 'fs-14', style: { opacity: 0.7 } },
                { html: <div className='br-6 p-h-3 fs-14' style={{ color: '#fff', background: 'orange' }}>{`${discountPercent}%`}</div> }
              ]
            },
            { html: `${SplitNumber(Math.floor(price - (price * discountPercent / 100)))} تومان`, className: 'fs-14 bold' },
          ]
        },
        { flex: 1 },
        {
          align: 'v', show: !disabled,
          html: (
            <AIOInput
              type='button' center={true} attrs={{ className: 'reserve-page-cart-button' }}
              text='موجود در سبد خرید'
              before={<Icon path={mdiDelete} size={1} />}
            />
          )
        }
      ]
    }
  }
  function getPriceLabel() {
    let { countUnit } = item;
    let timeLabel = '';
    if (item.timeType === 'hour') { timeLabel = ' هر ساعت' }
    else if (item.timeType === 'day') { timeLabel = ' هر روز' }
    let countLabel = ''
    if (item.countType) { countLabel = ` هر ${countUnit}` }
    return timeLabel || countLabel ? `قیمت بر اساس${timeLabel}${countLabel}` : 'قیمت';
  }

    return (
      <RVD
        layout={{
          style: { height: '100%' },
          className: 'reserve-page',
          column: [
            {
              flex: 1, className: 'ofy-auto',
              html: (
                <AIOInput
                  type='form' lang='fa' attrs={{ className: 'reserve-page-form' }}
                  inputClassName='reserve-page-input'
                  value={quantity}
                  inputs={{
                    props: { gap: 12 },
                    column: [
                      images_layout(),
                      row_layout('عنوان', name),
                      row_layout('توضیحات', description),
                      row_layout(getPriceLabel(), `${SplitNumber(item.price)} تومان`),
                      count_layout(),
                      day_layout(timeType),
                      hours_layout(),
                      //this.hours_layout(timeType),
                      result_layout()
                    ]
                  }}
                  onChange={(model, errors) => {
                    changeQuantity({ ...model })
                    setErrors(errors)
                  }}
                  getErrors={(errors:string[]) => setErrors(errors)}
                />
              )
            },
            footer_layout()
          ]
        }}
      />
    )
}