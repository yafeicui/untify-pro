import React, {Component} from 'react';
import { Form, Row, Col, Button } from 'antd';

const FormItem = Form.Item;
class CommentForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.onSubmit(values);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
  }
  formItemStyle = {
    labelCol: { span: this.props.labelCol ? this.props.labelCol : 8 },
    wrapperCol: { span: this.props.wrapperCol ? this.props.wrapperCol : 16 }
  }
  drawItem = (config) => {
    const { getFieldDecorator } = this.props.form;
    return getFieldDecorator(config.fieldName, {
      rules: config.rules,
      initialValue: config.initialValue,
    })(
      config.instance
        ? config.instance
        : <config.component {...config.props} disabled={config.disableStatus} />
    )
  }
  createFormItem = (config) => {
    const colNum = Math.floor(24 / this.props.colNum) || 1;
    return (
      <Col span={colNum} style={{ textAlign: this.props.align || 'right' }}>
        <FormItem
          label="Note"
          {...this.formItemStyle}
          label={config.label}
        >
          {this.drawItem(config)}
        </FormItem>
      </Col>
    )
  }
  render() {
    const buttonstyle = this.props.buttonstyle ? this.props.buttonstyle : 'inline';
    const align = this.props.align ? this.props.align : 'right';
    const ifShowReset = this.props.resetButton ? this.props.resetButton : 'inline';
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSubmit}
      >
        <Row gutter={24}>
          {
            this.props.formConfig.map(ele => this.createFormItem(ele))
          }
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: align, display: buttonstyle}}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8,display: ifShowReset }} onClick={this.handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(CommentForm);

