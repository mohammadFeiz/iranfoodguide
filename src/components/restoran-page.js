import React, { Component } from 'react';
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import AIOButton from '../npm/aio-button/aio-button';
import AIODate from '../npm/aio-date/aio-date';
import Map from './../npm/map/map';
import { Icon } from '@mdi/react';
import { mdiArrowRight, mdiChevronDown, mdiChevronUp, mdiClock, mdiClose, mdiComment, mdiTable, mdiWallet } from '@mdi/js';
import { icons } from './../icons';
import shandiz_logo from './../images/shandiz_logo.png';
import shandiz_image from './../images/shandiz_image.png';
import Rate from './../components/rate';
import SVG_Cart from './../svgs/cart';
import GroupButton from './group-button';
import percent1 from '../svgs/percent1';
import AppContext from '../app-context';
import SearchBox from './search-box';
import AIOShop from './../npm/aio-shop/aio-shop';
import ersal_ba_peyk_svg from '../svgs/ersal-ba-peyk';
import daryafte_hozoori_svg from '../svgs/daryafte-hozoori';
import pardakhte_online_src from '../images/pardakhte-online.png';
import pardakhte_kife_pool_src from '../images/pardakhte-kife-pool.png';
import kart_be_kart_src from '../images/kart-be-kart.png';
import pardakhte_hozoori_src from '../images/pardakhte-hozoori.png';
import { splitNumber } from '../npm/react-super-app/react-super-app';

export default class RestoranPage extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      category: false,
      menu: [],
      categories:[],
      activeTabId:'menu',
      tabMode:true,
      coupons:[],
      cartTab:true
    }
  }
  getIcon(option){
    let icon = {
      'ارسال با پیک':()=>ersal_ba_peyk_svg(),
      'دریافت حضوری':()=>daryafte_hozoori_svg(),
      'پرداخت آنلاین':()=><img src={pardakhte_online_src} />,
      'پرداخت کیف پول':()=><img src={pardakhte_kife_pool_src} />,
      'کارت به کارت':()=><img src={kart_be_kart_src} />,
      'پرداخت حضوری':()=><img src={pardakhte_hozoori_src} />,
    }[option];
    return (<div style={{width:60}} className='align-vh'>{icon()}</div>)
  }
  getShippingOptions(){
    let { addresses } = this.context;
    let { address } = this.props;
    let {coupons} = this.state;
    return [
      {
          title:'روش تحویل سفارش',field:'deliveryType',def:'ارسال با پیک',
          options:[
              { text: 'ارسال با پیک', value: 'ارسال با پیک', icon: this.getIcon('ارسال با پیک') },
              { text: 'دریافت حضوری', value: 'دریافت حضوری', icon: this.getIcon('دریافت حضوری') },
          ]
      },
      {
          show:({deliveryType})=>deliveryType === 'ارسال با پیک',title:'آدرس تحویل سفارش',subtitle:'انتخاب از آدرس های من',field:'addressId',def:addresses[0].id,
          options:addresses.map(({address,id})=>{return { text: address, value: id }})
      },
      {type:'html',show:({deliveryType})=>deliveryType === 'دریافت حضوری',title:'آدرس تحویل سفارش',subtitle:'آدرس رستوران',html:address},
      {
          title:'روش پرداخت مبلغ سفارش',field:'paymentType',def:'پرداخت آنلاین',
          options:[
              { text: 'پرداخت آنلاین', value: 'پرداخت آنلاین', icon: this.getIcon('پرداخت آنلاین'), subtext: 'پرداخت از طریق درگاه های پرداخت ' },
              { text: 'پرداخت کیف پول(10% تخفیف)', value: 'پرداخت کیف پول', icon: this.getIcon('پرداخت کیف پول'), subtext: 'مانده اعتبار : 250،000 ریال' },
              { text: 'پرداخت حضوری', value: 'پرداخت حضوری', icon: this.getIcon('پرداخت حضوری'), subtext: 'پرداخت از طریق دستگاه پوز پیک یا فروشگاه' },
              { text: 'کارت به کارت', value: 'کارت به کارت', icon: this.getIcon('کارت به کارت'), subtext: 'واریز به کارت ایران فود' }
          ]
      },
      {
        type:'html',
        show:({paymentType})=>paymentType === 'کارت به کارت',
        title:'اطلاعات حساب ایران فود',
        html:'6219861033538751'
      },
      {
        title:'کوپن های تخفیف',field:'selectedCouponIds',def:[],show:()=>!!coupons.length,multiple:true,
        options:({factor})=>{
          return coupons.map(({id,title,discountPercent,discount,maxDiscount,minCartAmount = 0})=>{
            let subtext = '';
            if(discountPercent){
              subtext += `${discountPercent} درصد تخفیف `
            }
            else if(discount){
              subtext += `${splitNumber(discount)} تومان تخفیف `
            }
            if(maxDiscount){ subtext += `تا سقف ${splitNumber(maxDiscount)} تومان `}
            if(minCartAmount){subtext += `برای سبد بالای ${splitNumber(minCartAmount)} تومان `}
            let disabled = minCartAmount > factor.total - factor.discount;
            return {text:title,subtext,value:id,disabled}
          })
        }
      }
    ]
  }
  async componentDidMount() {
    let { apis } = this.context;
    let { id } = this.props;
    apis({
      api: 'restoran_menu',
      parameter: id,
      callback: (menu) => {
        let categories = menu;
        let category = categories[0].name; 
        this.setState({ menu,categories,category })
      }
    })
    apis({
      api:'restoran_coupons',
      parameter:id,
      name:'دریافت کوپن های تخفیف رستوران',
      callback:(coupons)=>this.setState({coupons})
    })
    let Shop = AIOShop({
      id:'iranfoodrestorancart' + id,cartCache:true,
      setState:()=>this.setState({Shop:this.state.Shop}),
      getShippingOptions:()=>this.getShippingOptions(),
      productFields:{id:'id',name:'name',price:'price',discountPercent:'discountPercent',description:'description',image:'image'},
      checkDiscountCode:()=>{
        return 123000;
        return 'کد معتبر نیست'
      },
      getDiscounts:({factor,shipping})=>{
        let {coupons} = this.state;
        let {selectedCouponIds = []} = shipping;
        let discounts = [];
        if(shipping.paymentType === 'پرداخت کیف پول'){
          discounts.push({discountPercent:10,title:'تخفیف پرداخت با کیف پول'})
        }
        for(let i = 0; i < selectedCouponIds.length; i++){
          let id = selectedCouponIds[i];
          let coupon = coupons.find((coupon)=>coupon.id === id);
          discounts.push(coupon);
        }
        return discounts
      },
      getShippingPrice:({factor,shipping})=>{
        if(shipping.paymentType === 'پرداخت حضوری'){return 0}
        return 53000
      }
    })
    this.setState({Shop})
  }
  header_layout(cartLength) {
    let { image, rate, onClose } = this.props;
    let {cartTab} = this.state;
    return (
      {
        html:(
          <Header
            rate={rate}
            image={image}
            icons={[
              {icon:<Icon path={mdiClose} size={1}/>,onClick:()=>onClose()},
              {icon:SVG_Cart(),onClick:()=>this.openPopup('cart'),badge:cartLength,show:!cartTab},
            ]}
          />
        )
      }
    )
  }
  title_layout() {
    let { logo, name, distance } = this.props;
    let {tabMode} = this.state;
    return {
      className: 'p-h-12 m-b-12',
      row: [
        {flex:1,html:<RestoranTitle {...{logo, name, distance}}/>},
        {
          show:!tabMode,
          align: 'v',
          html: (
            <AIOButton
              type='button'
              text={'مشاهده اطلاعات'}
              className='button-3'
              onClick={()=>this.openPopup('info')}
            />
          )
        }
      ]
    }
  }
  tabs_layout(cartLength){
    let {activeTabId,tabMode,cartTab} = this.state;
    if(!tabMode){return false}
    return {
      className:'m-b-12',
      html:(
        <AIOButton
          type='tabs'
          options={[
            {text:'منوی رستوران',value:'menu',style:{flex:1}},
            {text:'اطلاعات رستوران',value:'info',style:{flex:1}},
            {text:'سبد خرید',value:'cart',style:{flex:1},before:<div className='badge-2'>{cartLength}</div>,show:!!cartTab},
          ]}
          value={activeTabId}
          onChange={(activeTabId)=>this.setState({activeTabId})}
        />
      )
    }
  }
  category_layout() {
    let { category,categories } = this.state;
    if(categories.length <= 1){return false}
    return {
      className: 'p-h-12 m-b-12',
      html: (
        <GroupButton
          type='menu'
          value={[category]} className='outline'
          options={categories.map(({name,image}) => { return { text: name, value: name,image } })}
          onChange={(values, value) => this.setState({ category: value })}
        />
      )
    }
  }
  filter_layout() {
    let { tags } = this.props;
    let { category } = this.state;
    return {
      className: 'p-h-12 m-b-12',
      row: [
        {flex: 1,html: <SearchBox onChange={(searchValue) => this.setState({ searchValue })} />},
        { size: 12 },
        {
          html: (
            <AIOButton
              className='select-2' type='select' value={category} options={tags} optionText='option' optionValue='option'
              onChange={(category) => this.setState({ category })} style={{ width: 90 }}
            />
          )
        }
      ]
    }
  }
  foods_layout() {
    let { menu,category,Shop } = this.state;
    if(!Shop){return false}
    let activeMenu = menu.find(({name})=>name === category);
    if(!activeMenu){return false}
    let foods = activeMenu.items;
    return {
      gap: 12, flex: 1, className: 'ofy-auto',
      column: foods.map((o) => {
        let {items = []} = o;
        let html;
        if(items.length){
          html = (
            <button className='joziate-ghaza button-2'>جزییات</button>
          )
        }
        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard(o,{addCart:'سفارش',changeCart:true,html}) }
      })
    }
  }
  openPopup(key,parameter){
    let {Shop} = this.state;
    let {rsa_actions} = this.context;
    let {addPopup} = rsa_actions;
    if(key === 'info'){
      addPopup({
        type:'fullscreen',header:false,
        body:()=>{
          return <RestoranInfo {...this.props} onClose={()=>rsa_actions.removePopup()}/>
        }
      })
    }
    else if(key === 'cart'){
      addPopup({
        type:'fullscreen',header:false,
        body:()=>{
          return <RestoranCart {...this.props} Shop={Shop} onClose={()=>rsa_actions.removePopup()} onSubmit={()=>this.openPopup('shipping')}/>
        }
      })
    }
    else if(key === 'shipping'){
      addPopup({
        type:'fullscreen',header:false,
        body:()=>{
          return <Shipping {...this.props} Shop={Shop} onClose={()=>rsa_actions.removePopup()}/>
        }
      })
    }
    else if(key === 'food details'){
      addPopup({
        type:'fullscreen',header:false,
        body:()=>{
          return ''
        }
      })
    }
  }
  info_layout(){
    let {tabMode,activeTabId} = this.state;
    if(!tabMode || activeTabId !== 'info'){return false}
    return {
      flex:1,
      html:<RestoranInfo {...this.props} header={false}/>
    }
  }
  cart_layout(){
    let {tabMode,activeTabId,Shop} = this.state;
    if(!tabMode || activeTabId !== 'cart'){return false}
    return {
      flex:1,
      html:<RestoranCart {...this.props} Shop={Shop} onSubmit={()=>this.openPopup('shipping')} header={false}/>
    }
  }
  render() {
    let {tabMode,activeTabId,Shop} = this.state;
    let cartLength = Shop?Shop.getCart_list().length:0;
    
    return (
      <RVD
        layout={{
          style:{height:'100%',background:'#fff'},
          column: [
            this.header_layout(cartLength),
            this.title_layout(),
            this.tabs_layout(cartLength),
            //this.filter_layout(),
            {
              show:!tabMode || (tabMode && activeTabId === 'menu'),
              flex:1,
              column:[
                this.category_layout(),
                this.foods_layout()
              ]
            },
            this.info_layout(),
            this.cart_layout()
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
RestoranPage.defaultProps = {
  name: 'رستوران 1', image: shandiz_image, logo: shandiz_logo,id:'1233445',
  rate: 3.4,ifRate:4, distance: 3, time: 35, tags: ['ایرانی', 'کبابی', 'فست فود', 'خارجی', 'سالادبار', 'عربی', 'صبحانه'],
  address:'تهران خیابان شیخ بهایی خیابان نوربخش پلاک 30 واحد 4 طبقه دوم',
  ifComment:'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساساً مورد استفاده قرار گیرد'
}

// class RestoranCart extends Component{
//   constructor(props){
//     super(props);
//   }
//   header_layout(image){
//     let {onClose,header} = this.props;
//     if(header === false){return false}
//     return {
//       html:(
//         <Header
//           image={image}
//           title='سبد خرید'
//           icons={[
//             {icon:<Icon path={mdiClose} size={1}/>,onClick:()=>onClose()}
//           ]}
//         />
//       )
//     }
//   }
//   items_layout(cartItems,Shop){
//     if(!cartItems.length){return {html:'سبد خرید شما خالی است',align:'vh'}}
//     return {
//       className:'m-b-24 of-visible',
//       column:[
//         {
//           flex:1,className:'of-visible',gap:12,
//           column:cartItems.map(({product})=>{
//             return {className:'p-h-12 of-visible',html:Shop.renderProductCard(product,{changeCart:true})}
//           })
//         }
//       ]
//     }
//   }
//   total_layout(cartItems,Shop){
//     if(!cartItems.length){return false}
//     return {html:Shop.renderTotal(),className:'p-12 br-6 m-h-12',style:{background:'#fff',border:'1px solid #ddd'}}
//   }
//   submit_layout(cartItems){
//     if(!cartItems.length){return false}
//     let {onSubmit} = this.props;
//     return {
//       className:'p-12',html:<button onClick={()=>onSubmit()} className='button-5 w-100 h-36 bold'>تکمیل خرید</button>
//     }
//   }
//   render(){
//     let {image,Shop} = this.props;
//     let cartItems = Shop.getCart_list()
//     return (
//       <RVD
//         layout={{
//           className:'bgFFF h-100',
//           column:[
//             this.header_layout(image),
//             {
//               flex:1,className:'ofy-auto',
//               column:[
//                 this.items_layout(cartItems,Shop),
                
//               ]
//             },
//             {
//               column:[
//                 this.total_layout(cartItems,Shop),
//                 this.submit_layout(cartItems)
//               ]
//             }

//           ]
//         }}
//       />
//     )
//   }
// }
class RestoranCart extends Component{
  constructor(props){
    super(props);
  }
  header_layout(image){
    let {onClose,header} = this.props;
    if(header === false){return false}
    return {
      html:(
        <Header
          image={image}
          title='سبد خرید'
          icons={[
            {icon:<Icon path={mdiClose} size={1}/>,onClick:()=>onClose()}
          ]}
        />
      )
    }
  }
  cart_layout(Shop){
    let {onSubmit} = this.props;
    return {
      flex:1,
      html:Shop.renderCart({onSubmit})
    }
  }
  render(){
    let {image,Shop} = this.props;
    return (
      <RVD
        layout={{
          className:'bgFFF h-100',
          column:[
            this.header_layout(image),
            this.cart_layout(Shop)
          ]
        }}
      />
    )
  }
}
class Shipping extends Component{
  static contextType = AppContext;
  constructor(props){
    super(props);
    this.state = {
      discountCode:'',
    }
  }
  header_layout(image){
    let {onClose} = this.props;
    return {
      html:(
        <Header
          image={image}
          title='تکمیل خرید'
          icons={[
            {icon:<Icon path={mdiClose} size={1}/>,onClick:()=>onClose()}
          ]}
        />
      )
    }
  }
  shipping_layout(Shop){
    return {flex:1,html:Shop.renderShipping()}
  }
  render(){
    let {image,Shop} = this.props;
    return (
      <RVD
        layout={{
          style:{background:'#fff',height:'100%'},
          column:[
            this.header_layout(image),
            this.shipping_layout(Shop)
          ]
        }}
      />
    )
  }
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
    apis({
      api:'restoran_comments',
      parameter:{id,pageSize:commentsPageSize,pageNumber:commentsPageNumber},
      name:'دریافت نظرات ثبت شده در مورد رستوران',
      callback:(comments)=>this.setState({comments})
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
  parts_layout(time) {
    let {comments} = this.state;
    let parts = [
      { text: `${time} دقیقه`, subtext: 'زمان ارسال', icon: mdiClock },
      //{text:`${shippingPrice} ریال`,subtext:'هزینه ارسال',icon:mdiWallet},
      { text: `${comments.length} نظر`, subtext: 'نظرات کاربران', icon: mdiComment },
      { text: `رزرو میز`, subtext: 'مشاهده میزها', icon: mdiTable, color: '#92C020' },
    ]
    return {
      gap: 1, gapAttrs: { style: { background: '#aaa' } },
      className: 'm-b-12',
      row: parts.map((o) => {
        return this.part_layout(o)
      })
    }
  }
  part_layout({ text, subtext, icon, color }) {
    return {
      flex: 1, style: { color },
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
    let {latitude,longitude,address,time,logo,name,rate,ifRate,ifComment} = this.props;
    let {comments} = this.state;
    return (
      <RVD
        layout={{
          className:'bgFFF h-100',
          column: [
            this.title_layout(logo,name,rate),
            {
              flex:1,className:'ofy-auto',
              column:[
                this.parts_layout(time,comments),
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
        <Map
          latitude={latitude}
          longitude={longitude}
          style={{width:84,height:84,borderRadius:12}}
        />
      )
    }
  }
  address_layout(address){
    return {flex:1,html:address,className:'bold fs-14',align:'v'}
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