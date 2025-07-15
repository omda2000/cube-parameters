export const useStandardViewsHandlers = () => {

  const viewTop = () => {
    console.log('viewTop called');
    const standardViews = (window as any).__standardViews;
    if (standardViews && standardViews.viewTop) {
      standardViews.viewTop();
    } else {
      console.log('standardViews not available');
    }
  };

  const viewFront = () => {
    console.log('viewFront called');
    const standardViews = (window as any).__standardViews;
    if (standardViews && standardViews.viewFront) {
      standardViews.viewFront();
    } else {
      console.log('standardViews not available');
    }
  };

  const viewBack = () => {
    console.log('viewBack called');
    const standardViews = (window as any).__standardViews;
    if (standardViews && standardViews.viewBack) {
      standardViews.viewBack();
    } else {
      console.log('standardViews not available');
    }
  };

  const viewBottom = () => {
    console.log('viewBottom called');
    const standardViews = (window as any).__standardViews;
    if (standardViews && standardViews.viewBottom) {
      standardViews.viewBottom();
    } else {
      console.log('standardViews not available');
    }
  };

  const viewRight = () => {
    console.log('viewRight called');
    const standardViews = (window as any).__standardViews;
    if (standardViews && standardViews.viewRight) {
      standardViews.viewRight();
    } else {
      console.log('standardViews not available');
    }
  };

  const viewLeft = () => {
    console.log('viewLeft called');
    const standardViews = (window as any).__standardViews;
    if (standardViews && standardViews.viewLeft) {
      standardViews.viewLeft();
    } else {
      console.log('standardViews not available');
    }
  };

  const viewIsometric = () => {
    console.log('viewIsometric called');
    const standardViews = (window as any).__standardViews;
    if (standardViews && standardViews.viewIsometric) {
      standardViews.viewIsometric();
    } else {
      console.log('standardViews not available');
    }
  };


  return {
    viewTop,
    viewFront,
    viewBack,
    viewBottom,
    viewRight,
    viewLeft,
    viewIsometric
  };
};