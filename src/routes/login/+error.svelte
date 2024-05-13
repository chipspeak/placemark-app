<script>
// @ts-nocheck

// Error page for use in passing server side login errors to user as login funcitonallity is mostly ssr
	import { page } from '$app/stores';
</script>
    <section class="hero is-fullheight is-default is-bold">
        <div class="hero-head"></div>
        <div class="hero-body">
          <div class="container">
            <div class="columns is-centered">
              <div class="column is-5">
                <h1 class="title has-text-success has-text-centered">Login Error<i class="ml-4 fas fa-solid fa-globe has-text-success"></i></h1>
                <div class="box has-text-centered has-text-danger">
                  {$page.error.message}
                </div>
                <a href="/login" class="mt-3 button is-success is-fullwidth"><span>Return to login</span>
                    <span class="icon is-small">
                      <i class="fa fa-undo"></i>
                    </span></a>
              </div>
            </div>
          </div>
        </div>
      </section>