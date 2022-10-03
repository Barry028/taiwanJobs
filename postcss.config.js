module.exports= {
  plugins: [ [require('autoprefixer')( {
    overrideBrowserslist: ['> 1%',
      'last 5 versions',
      'Firefox >= 45',
      'ios >=8',
      'Safari >=8',
      'ie >= 9'
      ]
  }

  )],
  ["postcss-preset-env",
    {
    // Options
  }

  ] // [require('postcss-modules')({
  // 	getJSON: ctx.extractModules || (() => {}),
  // })],
  ]
}