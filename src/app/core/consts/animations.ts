import { AnimationController } from "@ionic/angular";
import { createAnimation } from "@ionic/core";

const animationCtrl = new AnimationController()



// modal enter animation   " ion-backdrop "
export const EnterAnimation = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = animationCtrl
    .create()
    .addElement(root!.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

  const wrapperAnimation = animationCtrl
    .create()
    .addElement(root!.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0)' },
      { offset: 1, opacity: '0.99', transform: 'scale(1)' },
    ]);

  return animationCtrl
    .create()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
// moda; leave animation
export const LeaveAnimation = (baseEl: HTMLElement) => {
  return EnterAnimation(baseEl).direction('reverse');
}

//Alert Enter animation    " alert-wrapper "
export const alertEnterAnimation = (baseEl: HTMLElement) => {
  return animationCtrl.create()
    .addElement(baseEl.querySelector('.alert-wrapper')!)
    .duration(200)
    .easing('ease-out')
    .fromTo('opacity', '0', '1')
    .fromTo('transform', 'scale(0.8)', 'scale(1)');
};
// Alert Leave Animation
export const alertLeaveAnimation = (baseEl: HTMLElement) => {
  return animationCtrl.create()
    .addElement(baseEl.querySelector('.alert-wrapper')!)
    .direction('reverse')
}


//Popover Enter animation    " alert-wrapper "
export const popoverEnterAnimation = (baseEl: HTMLElement) => {
  return createAnimation()
    .addElement(baseEl.querySelector('popover-wrapper')!)
    .duration(200)
    .easing('ease-out')
    .fromTo('opacity', '0', '1')
    .fromTo('transform', 'scale(0.8)', 'scale(1)');
};
// Popover Leave Animation
export const popoverLeaveAnimation = (baseEl: HTMLElement) => {
  return createAnimation()
    .addElement(baseEl.querySelector('.popover-wrapper')!)
    .direction('reverse')
}
