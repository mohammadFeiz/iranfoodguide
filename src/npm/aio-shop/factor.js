import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import SplitNumber from '../aio-functions/split-number';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiMinus } from '@mdi/js';

export default class Factor extends Component {
    total_layout(total,unit) {
        return {
            className: 'as-fs-m as-fc-m',
            row: [
                { html: 'مجموع قیمت' },
                { flex: 1 },
                { html: SplitNumber(total), align: 'v' },
                { size: 3 },
                { html: unit, className: 'as-fs-s as-fc-l', align: 'v' }
            ]
        }
    }
    discount_layout(discount,unit) {
        if (!discount) { return false }
        return {
            className: 'as-fs-m as-fc-m',
            row: [
                { html: 'مجموع تخفیف' },
                { flex: 1 },
                { html: SplitNumber(discount), align: 'v' },
                { size: 3 },
                { html: unit, className: 'as-fs-s as-fc-l', align: 'v' },
                { html: <Icon path={mdiMinus} size={0.7} />, align: 'vh', style: { color: 'red' } }
            ]
        }
    }
    discounts_layout(discounts,unit) {
        if (!discounts.length) { return false }
        return {
            gap: 12,
            column: discounts.map(({ title, discountPercent = 0, discount }) => {
                return this.row_layout({title,percent:discountPercent,amount:discount,dir:-1},unit)
            })
        }
    }
    row_layout({title,percent,amount,dir},unit){
        return {
            row: [
                { html: title,className:'as-fs-m as-fc-m' },
                { flex: 1 },
                { show: !!percent, html: `(${percent}%)`, className: 'm-h-3 as-fs-m as-fc-m' },
                { html: SplitNumber(amount), align: 'v',className:'as-fs-m as-fc-m' },
                { size: 3 },
                { html: unit, className: 'as-fs-s as-fc-l', align: 'v' },
                { html: <Icon path={dir === -1 ? mdiMinus:mdiPlus} size={0.7} />, align: 'vh', style: { color: dir === -1?'red':'green' } }
            ]
        }
    }
    extras_layout(extras,unit) {
        if (!extras.length) { return false }
        return {
            gap: 12,
            column: extras.map(({ title, percent, amount }) => {
                return this.row_layout({title,percent,amount,dir:1},unit)
            })
        }
    }
    amount_layout(amount,unit) {
        return {
            className: 'as-fs-l as-fc-d',
            row: [
                { html: 'قابل پرداخت', className: 'bold' },
                { flex: 1 },
                { html: SplitNumber(amount), align: 'v', className: 'bold' },
                { size: 3 },
                { html: unit, className: 'as-fs-s as-fc-l', align: 'v' }
            ]
        }
    }
    render() {
        let { getFactor,unit } = this.props;
        let { total, discount, discounts = [], amount, extras = [] } = getFactor();
        return (
            <RVD
                layout={{
                    gap: 12,
                    column: [
                        this.total_layout(total,unit),
                        this.discount_layout(discount,unit),
                        this.discounts_layout(discounts,unit),
                        this.extras_layout(extras,unit),
                        this.amount_layout(amount,unit)
                    ]
                }}
            />
        )
    }
}