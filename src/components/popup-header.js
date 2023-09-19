import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import AppContext from "../app-context";
import { Icon } from '@mdi/react';
import { mdiChevronRight } from "@mdi/js";
export default class PopupHeader extends Component {
    static contextType = AppContext;
    onClose() {
        let { rsa } = this.context;
        rsa.removeModal();
    }
    render() {
        let { title } = this.props;
        return (
            <RVD
                layout={{
                    style: { height: 48, background: '#fff' },
                    row: [
                        { size: 48, html: <Icon path={mdiChevronRight} size={1} />, align: 'vh', onClick: () => this.onClose() },
                        { flex: 1, html: title, className: 'fs-18 bold', align: 'vh' },
                        { size: 48 }
                    ]
                }}
            />
        )
    }
}

