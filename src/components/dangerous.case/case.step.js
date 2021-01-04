import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

export default function Notification(SweetAlertRenderProps) {
return (
    <div>
        <SweetAlert
 title={"Uses render props"}
 onConfirm={this.onConfirm}
 onCancel={this.onCancel}
 type={'controlled'}
 dependencies={[this.SweetAlertRenderProps[0].Subject]}
>
  {() => (
    <form>
      Your name is: {this.SweetAlertRenderProps[0].Subject}
      <hr/>
      <br />
      <hr/>
    </form>
  )}
</SweetAlert>
    </div>
)
}
