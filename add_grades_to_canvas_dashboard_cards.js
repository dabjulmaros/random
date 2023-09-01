const gradebookSvg = "M1801.44118,-3.41060513e-13 L1801.44118,1920 L219.029412,1920 L219.029412,1480.78431 L162.514706,1480.78431 C131.318588,1480.78431 106,1455.48549 106,1424.31373 C106,1393.14196 131.318588,1367.84314 162.514706,1367.84314 L162.514706,1367.84314 L219.029412,1367.84314 L219.029412,1029.01961 L162.514706,1029.01961 C131.318588,1029.01961 106,1003.72078 106,972.54902 C106,941.377255 131.318588,916.078431 162.514706,916.078431 L162.514706,916.078431 L219.029412,916.078431 L219.029412,577.254902 L162.514706,577.254902 C131.318588,577.254902 106,551.956078 106,520.784314 C106,489.612549 131.318588,464.313725 162.514706,464.313725 L162.514706,464.313725 L219.029412,464.313725 L219.029412,-3.41060513e-13 L1801.44118,-3.41060513e-13 Z M1688.41176,112.941176 L332.058824,112.941176 L332.058824,464.313725 L388.573529,464.313725 C419.769647,464.313725 445.088235,489.612549 445.088235,520.784314 C445.088235,551.956078 419.769647,577.254902 388.573529,577.254902 L388.573529,577.254902 L332.058824,577.254902 L332.058824,916.078431 L388.573529,916.078431 C419.769647,916.078431 445.088235,941.377255 445.088235,972.54902 C445.088235,1003.72078 419.769647,1029.01961 388.573529,1029.01961 L388.573529,1029.01961 L332.058824,1029.01961 L332.058824,1367.84314 L388.573529,1367.84314 C419.769647,1367.84314 445.088235,1393.14196 445.088235,1424.31373 C445.088235,1455.48549 419.769647,1480.78431 388.573529,1480.78431 L388.573529,1480.78431 L332.058824,1480.78431 L332.058824,1807.05882 L1688.41176,1807.05882 L1688.41176,112.941176 Z M1179.60784,338.823529 L1179.60784,451.764706 L671.372549,451.764706 L671.372549,1129.41176 L1349.01961,1129.41176 L1349.01961,734.117647 L1461.96078,734.117647 L1461.96078,1242.35294 L558.431373,1242.35294 L558.431373,338.823529 L1179.60784,338.823529 Z M1386.93396,414.640941 L1466.78337,494.490353 L1034.33161,926.942118 L809.465725,701.963294 L889.315137,622.113882 L1034.33161,767.243294 L1386.93396,414.640941 Z";
[...document.querySelectorAll(".ic-DashboardCard")].forEach(
  (e) => {
    const link   = e.querySelector('a[class*="link"]').getAttribute('href');// needs "/grades"
    const nav    = e.querySelector('nav');
    const action = e.querySelector('nav > a');
    
    if(action && nav && link){
      const clone = action.cloneNode(true);
      
      clone.href = `${link}/grades`;
      
      clone.title = `Grades ${clone.title.split(' - ')[1]}`
      clone.querySelector('.screenreader-only').innerText = clone.title;

      clone.querySelector('svg').setAttribute('name','IconGradebook');
      clone.querySelector('path').setAttribute('d',gradebookSvg);

      nav.appendChild(clone);
    }
  }
);
