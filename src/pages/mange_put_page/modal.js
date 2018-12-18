import React, { Component } from 'react'

import { Button, Modal, Form, Input, Select, InputNumber } from 'antd'
import './index.scss';
const FormItem = Form.Item
const Option = Select.Option;
class ModalLayer extends Component {
	render() {
		const { visible, onCancel, onCreate, form, title, formData, appIdList } = this.props
		const { getFieldDecorator } = form
		return <Modal visible={visible} title={title} okText="Create" onCancel={onCancel} onOk={onCreate} footer={[<Button key="submit" type="primary" onClick={onCreate} >
						提交
					</Button>]}>
				<Form className="put-page-modal">
					<FormItem label="应用" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
						{getFieldDecorator('appId', {
							initialValue: formData.appId,
							rules: [{ required: true, message: '请选择应用'}]
						})(
						<Select style={{ width: '100%' }}>
						{
							appIdList.map(ele => {
								return (
									<Option value={ele.id} key={ele.id}>{ele.desc}</Option>
								)
							})
						}
						</Select>)}
					</FormItem>
					<FormItem label="投放页面别名" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
						{getFieldDecorator('disName', {
							initialValue: formData.disName,
							rules: [{ required: true, message: '请输入投放页面别名'}]
						})(<Input />)}
					</FormItem>
					<FormItem label="android页面唯一id" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
						{getFieldDecorator('androidValue', {
							initialValue: formData.androidValue,
							rules: [{ required: false, message: '请输入android页面唯一id!' }]
						})(<Input />)}
					</FormItem>
					<FormItem label="ios页面唯一id" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
						{getFieldDecorator('iosValue', {
							initialValue: formData.iosValue,
							rules: [{ required: false, message: '请输入ios页面唯一id!' }]
						})(<Input />)}
					</FormItem>
					<FormItem label="一天弹屏限制" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
						{getFieldDecorator('fireworkCountOneDay', {
							initialValue: formData.fireworkCountOneDay,
							rules: [{ required: true, message: '请输入一天弹屏限制!'}]
						})(<Input type="number" />)}
					</FormItem>
					<FormItem label="弹屏间隔时间(秒)" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
						{getFieldDecorator('intervalSeconds', {
							initialValue: formData.intervalSeconds,
							rules: [{ required: true, message: '请输入弹屏间隔时间!'}]
						})(<InputNumber min={0} style={{width: '100%'}}/>)}
					</FormItem>
				</Form>
			</Modal>
	}
}

export default Form.create()(ModalLayer)
