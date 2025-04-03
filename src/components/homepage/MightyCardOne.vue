<template>
  <div class="relative block overflow-hidden rounded-lg border border-slate-900 p-4 sm:p-6 lg:p-8">
    <div class="flex justify-between sm:gap-4">
      <div class = "w-7/12">
        <h3 class="text-lg font-bold text-white sm:text-xl">
          主动防御
          <img
          alt=""
          src="../../assets/right_direct.png"
          class="inline rounded-lg object-cover shadow-sm size-6"/>
        </h3>
        <div class="mt-4">
          <p class="text-pretty text-sm text-gray-500">主动防御通过对人脸图像进行预处理,以溯源或破坏深度伪造起到防御效果.</p>
      </div>
      <div class = "w-2/12"></div>
      </div>
      <div class="sm:block sm:shrink-0 w-3/12">
        <img
          alt=""
          src="../../assets/perturb.png"
          class="rounded-lg object-cover shadow-sm size-32"
        />
      </div>
    </div>
    <span class="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-red-300 via-orange-500 to-green-300"></span>
  </div>
</template>