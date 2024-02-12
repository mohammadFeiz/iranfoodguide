import React, { Component, useContext, useState } from 'react';
import RVD from '../npm/react-virtual-dom';
import AIOInput from '../npm/aio-input/aio-input';
import AIODate from '../npm/aio-date';
import AIOStorage from 'aio-storage';
import { Icon } from '@mdi/react';
import { mdiArrowRight, mdiChevronDown, mdiChevronUp, mdiClock, mdiClose, mdiComment, mdiDelete, mdiReload, mdiTable, mdiWallet } from '@mdi/js';
import { icons } from '../icons';
import Rate from './rate';
import SVG_Cart from '../svgs/cart';
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
import { I_coupon, I_food, I_restoran, I_state } from '../typs';
import { I_shippingOption } from '../npm/aio-shop/types';
type I_menu = {[menuCategory:string]:I_food[]};
type I_RestoranPage = {restoran:I_restoran}
type I_tab = 'menu' | 'info' | 'cart' | 'reserve';
export default function RestoranPage(props:I_RestoranPage) {
  let {APIS,rsa,addresses}:I_state = useContext(AppContext);
  let {restoran} = props
  let [storage] = useState(AIOStorage('ifgcartcache' + restoran.id))
  let [activeMenu,setActiveMenu] = useState<string | false>(false);
  let [menuLength,setMenuLength] = useState<number>(0);
  let [menu,setMenu] = useState<I_menu | false>(false);
  let [activeTabId,setActiveTabId] = useState<I_tab>('menu');
  let [coupons,setCoupons] = useState<I_coupon | false>(false)
  constructor(props) {
    super(props);
    this.state = {
      cartTab:true,
      reserveItems:[]
    }
  }
  function getRestoranProp(prop){
    let {restoran} = this.props;
    return restoran[prop]
  }
  function getIcon(option){
    let icon = {
      'ارسال با پیک':()=>ersal_ba_peyk_svg(),
      'دریافت حضوری':()=>daryafte_hozoori_svg(),
      'پرداخت آنلاین':()=><img src={pardakhte_online_src as string} />,
      'پرداخت کیف پول':()=><img src={pardakhte_kife_pool_src as string} />,
      'کارت به کارت':()=><img src={kart_be_kart_src as string} />,
      'پرداخت حضوری':()=><img src={pardakhte_hozoori_src as string} />,
    }[option];
    return (<div style={{width:60}} className='align-vh'>{icon()}</div>)
  }
  function getShippingOptions({factor,shipping}){
    let address = this.getRestoranProp('address');
    let checkOutOptions
    let res:I_shippingOption[] = [
      {
        title:'روش تحویل سفارش',field:'deliveryType',value:'ارسال با پیک',
        options:[
            { text: 'ارسال با پیک', value: 'ارسال با پیک', icon: getIcon('ارسال با پیک') },
            { text: 'دریافت حضوری', value: 'دریافت حضوری', icon: getIcon('دریافت حضوری') },
        ]
      },
      {
          show:({deliveryType})=>deliveryType === 'ارسال با پیک',title:'آدرس تحویل سفارش',subtitle:'انتخاب از آدرس های من',field:'addressId',value:addresses[0].id,
          options:addresses.map(({address,id})=>{return { text: address, value: id }})
      },
      {show:({deliveryType})=>deliveryType === 'دریافت حضوری',title:'آدرس تحویل سفارش',subtitle:'آدرس رستوران',html:()=>address},
      {
          title:'روش پرداخت مبلغ سفارش',field:'paymentType',value:'پرداخت آنلاین',
          options:[
              { text: 'پرداخت آنلاین', value: 'پرداخت آنلاین', icon: getIcon('پرداخت آنلاین'), subtext: 'پرداخت از طریق درگاه های پرداخت ' },
              { text: 'پرداخت کیف پول(10% تخفیف)', value: 'پرداخت کیف پول', icon: getIcon('پرداخت کیف پول'), subtext: 'مانده اعتبار : 250،000 ریال' },
              { text: 'پرداخت حضوری', value: 'پرداخت حضوری', icon: getIcon('پرداخت حضوری'), subtext: 'پرداخت از طریق دستگاه پوز پیک یا فروشگاه' },
              { text: 'کارت به کارت', value: 'کارت به کارت', icon: getIcon('کارت به کارت'), subtext: 'واریز به کارت ایران فود' }
          ]
      },
      {
        show:({paymentType})=>paymentType === 'کارت به کارت',
        title:'اطلاعات حساب ایران فود',
        html:()=>'6219861033538751'
      }
    ]
    if(Array.isArray(coupons) && coupons.length){
      res.push({
        title:'کوپن های تخفیف',field:'selectedCouponIds',value:[],show:()=>true,
        multiple:true,
        options:coupons.map((coupon:I_coupon)=>{
          let subtext = '';
          if(coupon.discountPercent){
            subtext += `${coupon.discountPercent} درصد تخفیف `
          }
          else if(coupon.discount){
            subtext += `${SplitNumber(coupon.discount)} تومان تخفیف `
          }
          if(coupon.maxDiscount){ subtext += `تا سقف ${SplitNumber(coupon.maxDiscount)} تومان `}
          if(coupon.minCartAmount){subtext += `برای سبد بالای ${SplitNumber(coupon.minCartAmount)} تومان `}
          let disabled = coupon.minCartAmount > factor.total - factor.discount;
          return {text:coupon.title,subtext,value:coupon.id,disabled}
        })
      })
    }
    return res
  }
  function cartCache(type,cart){
    if(type === 'get'){return storage.load({name:'cart',def:[]})}
    else if(type === 'set'){storage.save({name:'cart',value:cart})}
  }
  function getReserveCacheDictionary(){
    return storage.load({name:'reservedata' + restoran.id,def:{}})
  }
  function setReserveCacheDictionary({product,count,model}){
    let {Shop} = this.state;
    Shop.setCartCount({product,count});
    let reserveCacheDictionary = this.getReserveCacheDictionary()
    reserveCacheDictionary[product.id] = {...model}
    this.storage.save({name:'reservedata' + restoran.id,value:reserveCacheDictionary})
  }
  async function componentDidMount() {
    let id = restoran.id;
    apis.request({
      api: 'backOffice.get_restoran_foods',
      description:'دریافت لیست غذا های رستوران',
      parameter: id,def:[],
      onSuccess: (foods:I_food[]) => {
        let menu:I_menu = {}
        let food_dic = {};
        let subFoods = {};
        let activeMenu;
        for(let i = 0; i < foods.length; i++){
          let food:I_food = foods[i];
          let {menuCategory,parentId,id} = food;
          food_dic[id] = food;
          if(!activeMenu){activeMenu = menuCategory;}
          if(parentId){
            subFoods[parentId] = subFoods[parentId] || [];
            subFoods[parentId].push(food);
            continue;
          }
          menu[menuCategory] = menu[menuCategory] || [];
          menu[menuCategory].push(food);
        }
        let keys = Object.keys(subFoods);
        for(let i = 0; i < keys.length; i++){
          let key = keys[i];
          food_dic[key].items = subFoods[key];
        }
        setActiveMenu(activeMenu);
        setMenuLength(Object.keys(menu).length);
        setMenu(menu)
        this.setState({ subFoods })
      }
    })
    apis.request({
      api:'restoran_coupons',
      parameter:id,
      description:'دریافت کوپن های تخفیف رستوران',def:[],
      onSuccess:(coupons)=>this.setState({coupons})
    })
    apis.request({
      api:'reserve.get_restoran_reserve_items',parameter:{restoranId:id},
      description:'دریافت خدمات رزرو رستوران در پنل کاربر',def:[],
      onSuccess:(reserveItems)=>this.setState({reserveItems})
    })
    let shopObject = {
      id:'iranfoodrestorancart' + id,
      unit:'تومان',
      addToCartText:'سفارش',
      cartCache:this.cartCache.bind(this),
      getShippingOptions:this.getShippingOptions.bind(this),
      payment:async ({shipping,factor,cart})=>{
        let {restoran} = this.props;
        let {deliveryType,addressId,selectedCouponIds} = shipping;
        let foods = Object.keys(cart).map((o)=>{return {foodId:o,count:cart[o].count}})
        let restoranId = restoran.id;
        let {amount} = factor;
        let res = await apis.request({
          api:'pardakht_online',
          description:'پرداخت آنلاین',
          parameter:{
            deliveryType,foods,restoranId,amount,selectedCouponIds,addressId
          }
        })
      }
    }
    let Shop = new AIOShop(shopObject)
    this.setState({Shop})
  }
  function header_layout(cartLength) {
    let { onClose } = this.props;
    let rate = this.getRestoranProp('rate');
    let image = this.getRestoranProp('image');
    let {cartTab,Shop} = this.state;
    return (
      {
        html:(
          <Header
            rate={rate}
            image={image}
            icons={[
              {icon:<Icon path={mdiClose} size={1}/>,onClick:()=>onClose()},
              {icon:SVG_Cart(),onClick:()=>Shop.openModal('cart'),badge:cartLength,show:!cartTab},
            ]}
          />
        )
      }
    )
  }
  function tabs_layout(cartLength){
    let {cartTab} = this.state;
    return {
      className:'m-b-12',
      html:(
        <AIOInput
          type='tabs'
          options={[
            {text:'منوی رستوران',value:'menu'},
            {text:'اطلاعات رستوران',value:'info'},
            {text:'رزرو',value:'reserve'},
            {text:'سبد خرید',value:'cart',after:<div className='br-12 p-3 h-12 align-vh' style={{background:'orange',color:'#fff'}}>{cartLength}</div>,show:!!cartTab},
          ]}
          value={activeTabId}
          onChange={(activeTabId:I_tab)=>setActiveTabId(activeTabId)}
        />
      )
    }
  }
  function category_layout() {
    if(!menuLength || menu === false){return false}
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
  function foods_layout() {
    let { Shop } = this.state;
    if(!Shop || !activeMenu || menu === false){return false}
    let foods = menu[activeMenu];
    return {
      gap: 12, flex: 1, className: 'ofy-auto',
      column: foods.map((o) => {
        let {items = []} = o;
        let html;
        if(items.length){
          html = (
            <button className='joziate-ghaza button-2' onClick={()=>this.openModal('subFoods',o)}>جزییات</button>
          )
        }
        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard({product:o,addToCart:true,floatHtml:html,type:'horizontal'}) }
      })
    }
  }
  function openModal(key,parameter){
    let {Shop,subFoods} = this.state;
    let {addModal} = rsa;
    if(key === 'subFoods'){
      addModal({
        position:'fullscreen',header:{title:`انواع ${parameter.name}`},
        body:{render:()=><SubFoods food={parameter} subFoods={subFoods} Shop={Shop}/>}
      })
    }
  }
  function menu_layout(){
    if(activeTabId !== 'menu' || menu === false){return false}
    return {flex:1,column:[category_layout(),foods_layout()]}
  }
  function info_layout(){
    if(activeTabId !== 'info'){return false}
    let {restoran} = this.props;
    return {
      flex:1,
      html:<RestoranInfo {...restoran} header={false}/>
    }
  }
  function cart_layout(){
    let {Shop} = this.state;
    if(activeTabId !== 'cart'){return false}
    return {
      flex:1,
      html:Shop.renderCart()
    }
  }
  function reserve_layout(){
    let {reserveItems,Shop} = this.state;
    if(!Shop || activeTabId !== 'reserve'){return false}
    let {restoran} = this.props;
    return {
      flex:1,className:'restoran-reserve-container h-100',
      html:(
        <RestoranReserve 
          reserveItems={reserveItems} restoranId={restoran.id} Shop={Shop} 
          reserveCacheDictionary={this.getReserveCacheDictionary()} setReserveCacheDictionary={this.setReserveCacheDictionary.bind(this)}
        />
      )
    }
  }
  if(coupons === false || menu === false){return (
    <RVD
        layout={{
          className:'restoran-page',align:'vh',
          column: [
            {html:'خطا در دریافت اطلاعات'},
            {html:(
              <button><Icon path={mdiReload} size={0.8}/>تلاش مجدد</button>
            )}
          ]
        }}
      />
  )}
  let cartLength = Shop?Shop.getCartItems().length:0;
  
  return (
    <>
      <RVD
        layout={{
          className:'restoran-page',
          column: [
            header_layout(cartLength),
            tabs_layout(cartLength),
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
class SubFoods extends Component{
  foods_layout(foods){
    let {Shop} = this.props;
    return {
      flex:1,className:'ofy-auto',gap:12,
      column:foods.map((o)=>{
        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard({product:o,addToCart:true,type:'horizontal'}) }
      })
    }
  }
  render(){
    let {food,subFoods} = this.props;
    let foods = subFoods[food.id];
    return (
      <RVD
        layout={{
          style:{background:'#f8f8f8',height:'100%'},
          column:[
            {size:12},
            this.foods_layout(foods)
          ]
        }}
      />
    )
  }
}
class Header extends Component{
  renderIcons(icons){
    let gap = 8;
    let size = 36;
    return icons.filter(({show = true})=>typeof show === 'function'?show():show).map(({icon,onClick,badge},i)=>{
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
  renderTitle(title){
    if(!title){return null}
    return (
      <div
        style={{
          position: 'absolute', background: '#ffffffdd', borderRadius: 6, display: 'flex',padding:'0 12px',
          right: 8, top: 8, height: 36
        }}
        className='align-vh bold fs-20'
      >
        {title}
      </div>
    )
  }
  render(){
    let {icons = [],rate,image,title} = this.props;
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
                        right: 8, bottom: 16, width: 96, height: 24,color:'orange'
                      }}
                      className='align-vh'
                    >
                      <Rate rate={rate} />
                    </div>
                  )
                }
                {this.renderIcons(icons)}
                {this.renderTitle(title)}
              </div>
            )
          }}  
        />
      
    )
  }
}
function RestoranReserve({Shop,reserveItems,restoranId,reserveCacheDictionary,setReserveCacheDictionary}){
  let context = useContext(AppContext)
  function getProduct({price,discountPercent,name,id,countType,minCount,maxCount,returnAmount,countUnit,timeType,image1,image2,image3}){
    let image = image1 || image2 || image3;
    let description = ''
    let countText = countType?`${minCount} تا ${maxCount} ${countUnit}`:'';
    let returnText = returnAmount?`بازگشت مبلغ روی فاکتور`:'';
    let timeText = '';
    if(timeType === 'hour'){timeText = 'ساعتی'}
    else if(timeType === 'day'){timeText = 'روزانه'}
    if(countText){description += countText + ' - '}
    if(timeText){description += timeText + ' - '}
    if(returnText){description += returnText}
    return {id,description,name,price,discountPercent,countType:false,image,isReserve:true}
  }
  function openPage(reserveItem,product){
    let {rsa} = context;
    let {addModal} = rsa;
    addModal({
      position:'fullscreen',header:{title:reserveItem.name},
      body:{
        render:()=>{
          let reserveCache = reserveCacheDictionary[product.id];
          let props = {item:reserveItem,product,Shop,restoranId,reserveCache,setReserveCacheDictionary}
          return (<ReservePage {...props}/>)
        }
      }
    })
  }
  return (
    <RVD
      layout={{
        className:'restoran-reserve h-100 ofy-auto p-12',
        flex:1,gap:12,
        column:reserveItems.map((reserveItem)=>{
          let product = getProduct(reserveItem);
          return {
            className:'of-visible',html:Shop.renderProductCard({product,onClick:()=>openPage(reserveItem,product),type:'horizontal'})
          }
        })
      }}
    />
  )
}
class RestoranInfo extends Component {
  static contextType = AppContext;
  constructor(props){
    super(props);
    this.state = {
      comments:[],
      commentsPageSize:12,
      commentsPageNumber:1
    }
  }
  componentDidMount(){
    let {apis} = this.context;
    let {id} = this.props;
    let {commentsPageNumber,commentsPageSize} = this.state;
    apis.request({
      api:'restoran_comments',
      parameter:{id,pageSize:commentsPageSize,pageNumber:commentsPageNumber},
      description:'دریافت نظرات ثبت شده در مورد رستوران',
      onSuccess:(comments)=>this.setState({comments})
    })
  }
  title_layout(logo,name,rate){
    let {onClose,header} = this.props;
    if(header === false){return false}
    return {
      className:'m-b-12 p-12 orange-bg colorFFF',
      row:[
        {size:36,html:<Icon path={mdiArrowRight} size={1}/>,align:'vh',onClick:()=>onClose()},
        {flex:1,html:<RestoranTitle {...{logo,name,rate}}/>}
      ]
    }
  }
  parts_layout(deliveryTime) {
    let {comments} = this.state;
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
      flex: 1, style: { color },className:'restoran-page-part',
      column: [
        { html: <Icon path={icon} size={0.7} />, align: 'vh', style: { color: '#00AD79' } },
        { size: 4 },
        { html: text, className: 'fs-12 bold', align: 'h' },
        { html: subtext, className: 'fs-10', align: 'h' }
      ]
    }
  }
  address_layout(latitude,longitude,address){
    return {
      className:'m-b-12 p-h-12',html:<Address {...{latitude,longitude,address}}/>
    }
  }
  downloadMenu_layout(){
    return {
      className:'m-b-12 p-h-12',html:<button className='button-3 w-100 br-6 h-36'>دانلود منو رستوران</button>
    }
  }
  IranFoodComment_layout(ifRate,ifComment){
    return {
      className:'p-h-12',html:<IranFoodComment {...{ifRate,ifComment}}/>
    }
  }
  comments_layout(comments){
    return {html:<RestoranComments comments={comments}/>}
  }
  render() {
    let {latitude,longitude,address,deliveryTime,logo,name,rate,ifRate,ifComment} = this.props;
    let {comments} = this.state;
    return (
      <RVD
        layout={{
          className:'h-100',
          column: [
            this.title_layout(logo,name,rate),
            {
              flex:1,className:'ofy-auto',
              column:[
                this.parts_layout(deliveryTime,comments),
                this.address_layout(latitude,longitude,address),
                this.downloadMenu_layout(),
                {size:12},
                this.IranFoodComment_layout(ifRate,ifComment),
                {size:12},
                this.comments_layout(comments)
              ]
            }
          ]
        }}
      />
    )
  }
}
class RestoranCoupons extends Component{
  coupons_layout(coupons) {
    if (!coupons.length) { return false }
    return {
      className:'m-b-12',
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
  render(){
    return (
      ''
    )
  }
}
class RestoranTitle extends Component{
  logo_layout(logo){
    if(!logo){return false}
    return { html: <img src={logo} width='100%' style={{ width: 42, height: 42, border: '1px solid #eee', borderRadius: '100%',background:'#fff' }} /> }
  }
  name_layout(name){
    return { html: name, className: 'fs-16 bold' }
  }
  distance_layout(distance){
    if(!distance){return false}
    return {
      row: [
        { html: icons('location', { color: '#292D32', width: 10, height: 12 }), align: 'vh' },
        { size: 3 },
        { html: () => `${distance} کیلومتر فاصله از شما`, className: 'fs-10 m-t-3', align: 'v' }
      ]
    }
  }
  rate_layout(rate){
    if(rate === undefined){return false}
    return {html:<Rate rate={rate}/>}
  }
  render(){
    let {logo,name,distance,rate} = this.props;
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
        } }
      />
    )
  }
}
class RestoranComments extends Component{
  header_layout(){
    return {html:'نظرات کاربران',className:'fs-14 bold m-b-6'}
  }
  comments_layout(comments){
    return {column:comments.map((o,i)=>this.comment_layout(o,i === 0,i === comments.length - 1))}
  }
  comment_layout({name,date,comment},isFirst,isLast){
    return {
      style:{borderBottom:'1px solid #eee',background:'#fff'},
      className:'p-6 br-6' + (isFirst?'':' br-t-0') + (isLast?'':' br-b-0'),
      column:[
        {
          size:36,
          row:[
            this.name_layout(name),
            {flex:1},
            this.date_layout(date)
          ]
        },
        {html:comment,className:'fs-12'},
        {size:12}
      ]
    }
  }
  name_layout(name){
    return {html:name,className:'fs-12 bold',align:'v'}
  }
  date_layout(date){
    let {day,hour,minute} = AIODate().getDelta({date});
    let html;
    if(day){html = `${day} روز پیش`}
    else if(hour){html = `${hour} ساعت پیش`}
    else if(minute){html = `${minute} دقیقه پیش`}
    else {html = 'چند لحظه پیش'}
    return {html,className:'fs-10 bold',align:'v'}
  }
  render(){
    let {comments} = this.props;
    return (
      <RVD
        layout={{
          style:{background:'#eee'},
          className:'p-12 br-12',
          column:[
            this.header_layout(),
            this.comments_layout(comments)
          ]
        }}
      />
    )
  }
}
class Address extends Component{
  map_layout(latitude,longitude){
    return {
      html:(
        <AIOInput
          type='map' lat={latitude} lng={longitude}
          mapConfig={{draggable:false}}
          style={{width:84,height:84,borderRadius:12}}
        />
      )
    }
  }
  address_layout(address){
    return {flex:1,html:address,className:'fs-14'}
  }
  render(){
    let {address,latitude,longitude} = this.props;
    return (
      <RVD
        layout={{
          row:[
            this.map_layout(latitude,longitude),
            {size:12},
            this.address_layout(address)
          ]
        }}
      />
    )
  }
}
class IranFoodComment extends Component{
  state = {showMode:false}
  header_layout(ifRate){
    return {
      className:'m-b-12 fs-14 bold',
      row:[
        {html:'نظر تخصصی ایران فود'},
        {flex:1},
        {html:'امتیاز ایران فود',className:'fs-12',align:'v'},
        {size:3},
        {html:<Rate rate={ifRate}/>,align:'v',style:{color:'orange'}}
      ]
    }
  }
  body_layout(ifComment){
    let {showMore} = this.state;
    return {
      size:showMore?undefined:96,
      className:'fs-12 m-b-12',html:ifComment
    }
  }
  footer_layout(){
    let {showMore} = this.state;
    return {
      className:'colorGreen bold fs-14',
      row:[
        {flex:1},
        {html:!showMore?'بیشتر':'کمتر',onClick:()=>this.setState({showMore:!showMore})},
        {html:<Icon path={!showMore?mdiChevronDown:mdiChevronUp} size={.8}/>,align:'vh'}
      ]
    }
  }
  render(){
    let {ifRate,ifComment} = this.props;
    return (
      <RVD
        layout={{
          column:[
            this.header_layout(ifRate),
            this.body_layout(ifComment),
            this.footer_layout()
          ]
        }}
      
      />
    )
  }
}
class ReservePage extends Component{
  static contextType = AppContext;
  constructor(props){
      super(props);
      let {item} = props;
      let {model,countDetails} = this.initialModel(item);
      this.state = {model,countDetails,errors:[],capacityOfHours:new Array(24).fill(0).map(()=>0)}
  }
  initialModel(item){
    let {reserveCache} = this.props;
    let countDetails,model = {};
    if(item.countType){countDetails = this.getCountDetails();}
    if(reserveCache){model = reserveCache}
    else {
      if(item.countType){model.count = countDetails.minCount;}
      else {model.count = 1}
      if(item.timeType === 'hour'){model.hours = []}
    }
    return {model,countDetails};
  }
  componentDidMount(){
    let {restoranId,item} = this.props;
    let {apis} = this.context;
    apis.request({
      api:'reserve.get_restoran_reserve_capacity',parameter:{restoranId,reserveItemId:item.id},
      description:'دریافت ظرفیت رزرو',def:new Array(24).fill(0).map(()=>0),
      onSuccess:(capacityOfHours)=>this.setState({capacityOfHours})
    })
    
  }
  changeModel(newModel){
    let {item,product,setReserveCacheDictionary} = this.props;
    let cartCount = newModel.count; 
    if(item.timeType === 'hour'){
      newModel.hours = newModel.hours.filter((o)=>{
        return this.hasCapacityInhours([o,o+1])
      });
      cartCount *= newModel.hours.length; 
    }
    setReserveCacheDictionary({product,count:cartCount?1:0,model:newModel})
    this.setState({model:newModel})
  }
  getCountDetails(){
      let {item} = this.props;
      let {minCount,maxCount,countUnit} = item;
      let validations = [['required','',{title:'تعداد'}],['>=',minCount,{title:'تعداد'}],['<=',maxCount,{title:'تعداد'}]]
      let label = `تعداد را مشخص کنید (از ${minCount} ${countUnit} تا ${maxCount} ${countUnit})`
      return {validations,label,minCount,maxCount,countUnit}
  }
  getAfter(text){
      return <div className='reserve-panel-input-after'>{text}</div>
  }
  row_layout(key,value){
      return {
          row:[
              {html:`${key} : `,className:'fs-12 bold'},
              {html:value,className:'fs-12',flex:1}
          ]
      }
  }
  getImage(url){
      return {html:<AIOInput type='image' value={url} preview={true} width={100} height={100} attrs={{style:{width:100,height:100}}}/>,size:100}
  }
  images_layout(image1,image2,image3){
      let images = [];
      if(image1){images.push(this.getImage(image1))}
      if(image2){images.push(this.getImage(image2))}
      if(image3){images.push(this.getImage(image3))}
      return {size:100,row:[{flex:1},{row:images},{flex:1}]}
  }
  day_layout(timeType){
      if(!timeType){return false}
      return {
              label:'انتخاب روز رزرو',
              input:{
                  type:'datepicker',
                  placeholder:'تایین نشده',
                  unit:'day',
                  calendarType:'jalali',
                  startYear:'-0',
                  endYear:'+0'
              },
              field:'value.date',
              validations:[['required']]
      }
  }
  count_layout(){
    let {item} = this.props;
    if(!item.countType){return false}
    let {countDetails} = this.state;
    let {countUnit,label,minCount,maxCount} = countDetails;
    return {
      input:{
          type:'slider',start:0,min:minCount,end:maxCount,after:this.getAfter(countUnit),showValue:'inline',direction:'left',
      },
      field:'value.count',label
    }
  }
  getDateText(){
      let {model} = this.state;
      if(model.hours){
          //return `1400 از ساعت ${model.hours[0]} تا ساعت ${model.hours[1]}`
          return `برای ساعات ${model.hours.join(' ')}`
      }
      return AIODate().getDateByPattern({date:model.date,pattern:'{year}/{month}/{day}'})
  }
  result_layout(name,countUnit,timeType){
      let {errors,model} = this.state;
      if(timeType === 'hour' && (!model.hours || !model.hours.length)){
        errors = errors.concat('ساعات رزرو را انتخاب کنید')
      }
      if(errors.length){
          return {
              align:'vh',
              style:{color:'red',padding:12,borderRadius:12,background:'#ff000020'},
              column:errors.map((error)=>{
                  return {size:36,align:'v',html:error}
              })
          }
      }
      return {
          style:{color:'green',padding:12,borderRadius:12,background:'#00800020'},
          column:[
              {html:`رزرو ${name}`},
              {show:!!model.count,html:`به تعداد ${model.count} ${countUnit}`},
              {show:!!model.date,html:`برای تاریخ ${model.date}`},
              {show:!!model.hours && !!model.hours.length,html:`برای ساعات ${model.hours.join(' ')}`}

          ]
      }
  }
  getHoursCapacity(){
      let {model,capacityOfHours} = this.state;
      let {count,date} = model;
      if(!date){return []}
      let res = [];
      for(let i = 0; i < capacityOfHours.length; i++){
          let o = capacityOfHours[i]
          if(o >= count){res.push(i)}
      }
      return res
  }
  hasCapacityInhours(hours){
      let hoursCapacity = this.getHoursCapacity();
      for(let i = hours[0]; i < hours[1]; i++){
          if(hoursCapacity.indexOf(i) === -1){return false}
      }
      return true
  }
  hours_layout(){
      let {item} = this.props;
      let {countType,timeType} = item;
      if(timeType !== 'hour'){return false}
      let hoursCapacity = this.getHoursCapacity();
      if(!hoursCapacity.length){return false}
      let {model,capacityOfHours} = this.state;
      let {hours} = model;
      return {
          column:[
              {html:`ساعات قابل رزرو ${countType?'برای تعداد انتخاب شده ':''}در روز انتخاب شده`,className:'aio-input-form-label'},
              {
                  html:(
                      <div style={{}}>
                          {capacityOfHours.map((o,i)=>{
                              let active = hours.indexOf(i) !== -1;
                              let disabled = !this.hasCapacityInhours([i,i+1])
                              return (
                                  <div 
                                      onClick={()=>{
                                          if(disabled){return}
                                          let {model} = this.state;
                                          let {hours} = model;
                                          let newHours = active?hours.filter((h)=>h !== i):hours.concat(i)
                                          this.changeModel({...model,hours:newHours})
                                      }}
                                      className={'reserve-page-hour-item' + (active?' active':'') + (disabled?' disabled':'')}
                                  >{`${i} : 00`}</div>
                              )
                          })}
                      </div>
                  )
              }
          ]
      }

  }
  footer_layout(){
    let {Shop,item} = this.props;
    let {model} = this.state;
    let {discountPercent = 0} = item;
    let disabled = false;
    let cartCount = Shop.getCartCount(item.id);
    let price = item.price * cartCount
    if(item.countType){
      if(!model.count){disabled = true}
      price *= model.count;
    }
    if(item.timeType === 'hour'){
      if(model.hours.length === 0){disabled = true}
      price *= model.hours.length;
    }
    return {
        className:'reserve-page-footer',
        row:[
          {
            show:!!price,align:'v',
            column:[
              {
                show:!!discountPercent,
                gap:12,align:'v',
                row:[
                  {html:<del>{`${SplitNumber(price)}`}</del>,className:'fs-14',style:{opacity:0.7}},
                  {html:<div className='br-6 p-h-3 fs-14' style={{color:'#fff',background:'orange'}}>{`${discountPercent}%`}</div>}
                ]
              },
              {html:`${SplitNumber(Math.floor(price - (price * discountPercent / 100)))} تومان`,className:'fs-14 bold'},
            ]
          },
          {flex:1},
          {
            align:'v',show:!disabled,
            html:(
              <AIOInput
                type='button' center={true} attrs={{className:'reserve-page-cart-button'}}
                text='موجود در سبد خرید'
                before={<Icon path={mdiDelete} size={1}/>}
              />
            )
          }
        ]
    }
  }
  getPriceLabel(){
    let {item} = this.props;
    let {countUnit} = item;
    let timeLabel = '';
    if(item.timeType === 'hour'){timeLabel = ' هر ساعت'}
    else if(item.timeType === 'day'){timeLabel = ' هر روز'}
    let countLabel = ''
    if(item.countType){countLabel = ` هر ${countUnit}`}
    return timeLabel || countLabel?`قیمت بر اساس${timeLabel}${countLabel}`:'قیمت';
  }
  
  render(){
      let {model} = this.state;
      let {item} = this.props
      let {name,image1,image2,image3,timeType,description,countUnit} = item;
      return (
          <RVD
              layout={{
                  style:{height:'100%'},
                  className:'reserve-page',
                  column:[
                      {
                          flex:1,className:'ofy-auto',
                          html:(
                              <AIOInput
                                  type='form' lang='fa' attrs={{className:'reserve-page-form'}}
                                  inputClassName='reserve-page-input'
                                  value={model}
                                  inputs={{
                                      props:{gap:12},
                                      column:[
                                          this.images_layout(image1,image2,image3),
                                          this.row_layout('عنوان',name),
                                          this.row_layout('توضیحات',description),
                                          this.row_layout(this.getPriceLabel(),`${SplitNumber(item.price)} تومان`),
                                          this.count_layout(countUnit),
                                          this.day_layout(timeType),
                                          this.hours_layout(),
                                          //this.hours_layout(timeType),
                                          this.result_layout(name,countUnit,timeType)
                                      ]
                                  }}
                                  onChange={(model,errors)=>{
                                      this.changeModel({...model})
                                      this.setState({errors})
                                  }}
                                  getErrors={(errors)=>this.setState({errors})}
                              />
                          )
                      },
                      this.footer_layout()
                  ]
              }}
          />
      )
  }
}